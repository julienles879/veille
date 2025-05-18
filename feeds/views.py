import logging
import os

import replicate
import requests
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django_filters.rest_framework import DjangoFilterBackend
from dotenv import load_dotenv
from rest_framework import filters, generics
from rest_framework.generics import RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from rest_framework.views import APIView

from articles.models import *
from articles.serializers import *
from articles.tasks import fetch_articles_for_feeds

from .models import *
from .serializers import *

load_dotenv()

logger = logging.getLogger(__name__)

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")

if not REPLICATE_API_TOKEN:
    raise Exception("Missing REPLICATE_API_TOKEN in environment variables.")

client = replicate.Client(api_token=REPLICATE_API_TOKEN)


def generate_sd_image(category_name, output_path):
    prompt = f"A realistic photo of a scene representing the theme '{category_name}', suitable for illustrating a news RSS feed category. Cinematic angle, no text."

    try:
        output_url = client.run(
            "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
            input={"prompt": prompt, "num_outputs": 1},
        )[0]

        response = requests.get(output_url)
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(response.content)
        else:
            raise Exception("Erreur de téléchargement de l’image générée.")
    except Exception as e:
        print(f"⚠️ Erreur lors de la génération avec Replicate : {e}")


class ArticleSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    search_fields = ["title", "content", "feed__title"]
    ordering_fields = ["title", "published_at"]
    ordering = ["-published_at"]
    filterset_fields = ["feed__category__name"]

    def get_queryset(self):
        return RSSFeedEntry.objects.all()


class FavoritesSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "content", "feed__title"]
    ordering_fields = ["published_at", "title"]
    ordering = ["-published_at"]

    def get_queryset(self):
        return RSSFeedEntry.objects.filter(favorited_by__isnull=False).order_by(
            "-published_at"
        )


class CategorySearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Category.objects.all()


class ArticleSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "content", "feed__title"]

    def get_queryset(self):
        return RSSFeedEntry.objects.all().order_by("-published_at")


class ArticlePagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = "limit"
    max_page_size = 100


class RecentArticlesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RSSFeedEntrySerializer
    pagination_class = ArticlePagination

    def get_queryset(self):
        category_name = self.request.query_params.get("category__name", None)
        logger.debug(f"🟢 Catégorie reçue dans la requête : {category_name}")

        queryset = RSSFeedEntry.objects.all().order_by("-published_at")

        if category_name:
            queryset = queryset.filter(
                feed__category__name__iexact=category_name
            )
            logger.debug(
                f"✅ {queryset.count()} articles trouvés pour la catégorie '{category_name}'"
            )

        return queryset


class FeedArticlesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RSSFeedEntrySerializer
    pagination_class = ArticlePagination

    def get_queryset(self):
        feed_id = self.kwargs.get("feed_id")
        return RSSFeedEntry.objects.filter(feed_id=feed_id).order_by(
            "-published_at"
        )


class RSSFeedDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        try:
            feed = RSSFeed.objects.get(pk=pk)
            logger.debug(f"Flux trouvé : {feed.title}")
            articles = feed.entries.all()
            logger.debug(
                f"Articles associés : {[article.title for article in articles]}"
            )
            serializer = RSSFeedDetailSerializer(feed)
            return Response(serializer.data, status=200)
        except RSSFeed.DoesNotExist:
            logger.error(f"Flux avec ID {pk} introuvable")
            return Response({"error": "Flux RSS introuvable."}, status=404)


class RSSFeedListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RSSFeed.objects.all().order_by("-created_at")
    serializer_class = RSSFeedSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category__name"]
    search_fields = ["title", "description", "category__name"]
    ordering_fields = ["title", "created_at"]
    ordering = ["-created_at"]

    def post(self, request, *args, **kwargs):
        url = request.data.get("url")

        if not url:
            return Response(
                {"error": "URL manquante."}, status=HTTP_400_BAD_REQUEST
            )

        try:
            # 🔍 1. On cherche un flux existant avec cette URL
            feed = RSSFeed.objects.get(url=url)
        except RSSFeed.DoesNotExist:
            # 🆕 2. Sinon on le crée
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                feed = serializer.save(
                    user=request.user
                )  # On attribue le créateur du flux
            else:
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        # 🔗 3. On associe l’utilisateur au flux (si pas déjà fait)
        already_exists = UserRSSFeed.objects.filter(
            user=request.user, feed=feed
        ).exists()
        if not already_exists:
            UserRSSFeed.objects.create(user=request.user, feed=feed)
            fetch_articles_for_feeds()

        # 📤 On renvoie les données du flux (même s’il existait déjà)
        serializer = self.get_serializer(feed)
        return Response(serializer.data, status=HTTP_201_CREATED)


class RSSFeedRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RSSFeed.objects.all()
    serializer_class = RSSFeedSerializer


class RSSFeedFilterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        category = request.query_params.get("category", None)
        if category:
            queryset = RSSFeed.objects.filter(
                category__name__icontains=category
            )
            serializer = RSSFeedSerializer(queryset, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(
            {"error": "Category not specified"}, status=HTTP_400_BAD_REQUEST
        )


class CategoryListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()

            category_slug = category.name.lower().replace(" ", "_")
            image_dir = os.path.join(
                settings.MEDIA_ROOT, "images", "categorie", category_slug
            )

            try:
                os.makedirs(image_dir, exist_ok=True)
                image_path = os.path.join(image_dir, "img_sd.jpg")
                generate_sd_image(category.name, image_path)
                print(f"✅ Dossier + image générée par SD pour {category.name}")
            except Exception as e:
                print(f"⚠️ Erreur de génération image : {e}")

            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class CategoryDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def delete(self, request, *args, **kwargs):
        category_id = kwargs.get("pk")
        try:
            category = Category.objects.get(id=category_id)
            category.delete()
            return Response(
                {"message": "Catégorie supprimée avec succès."},
                status=HTTP_200_OK,
            )
        except Category.DoesNotExist:
            return Response(
                {"error": "Catégorie introuvable."}, status=HTTP_404_NOT_FOUND
            )


from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RSSFeed
from .serializers import RSSFeedSerializer


class SuggestedFeedsView(APIView):
    """
    Vue pour suggérer des flux populaires que l’utilisateur n’a pas encore ajoutés.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtenir les IDs des flux déjà ajoutés par l’utilisateur
        user_feeds_ids = request.user.rss_feeds.values_list("id", flat=True)

        # Chercher les flux ajoutés par le plus d’utilisateurs, sauf ceux déjà suivis par l’utilisateur courant
        suggestions = (
            RSSFeed.objects.exclude(id__in=user_feeds_ids)
            .annotate(user_count=Count("user"))
            .order_by("-user_count")[:10]
        )

        serializer = RSSFeedSerializer(suggestions, many=True)
        return Response(serializer.data)
