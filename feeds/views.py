from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *
from articles.serializers import *
from articles.models import *
import logging

logger = logging.getLogger(__name__)


class ArticleSearchView(generics.ListAPIView):
    """
    Vue pour rechercher des articles par titre, contenu et trier par catégorie ou date.
    """
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'content', 'feed__title']  # Recherche par mots-clés
    ordering_fields = ['title', 'published_at']  # Tri par titre (A-Z) et date
    ordering = ['-published_at']  # Tri par défaut : articles récents
    filterset_fields = ['feed__category__name']  # Filtre par catégorie

    def get_queryset(self):
        return RSSFeedEntry.objects.all()

class FavoritesSearchView(generics.ListAPIView):
    """
    Vue pour rechercher et trier les articles favoris.
    """
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'feed__title']
    ordering_fields = ['published_at', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        return RSSFeedEntry.objects.filter(favorited_by__isnull=False).order_by('-published_at')


class CategorySearchView(generics.ListAPIView):
    """
    Vue pour rechercher et trier les catégories.
    """
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Category.objects.all()


class ArticleSearchView(generics.ListAPIView):
    """
    Vue pour rechercher des articles par titre ou contenu.
    """
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content', 'feed__title']  # Recherche par titre, contenu, ou nom du flux RSS

    def get_queryset(self):
        return RSSFeedEntry.objects.all().order_by('-published_at')



class RecentArticlesView(generics.ListAPIView):
    """
    Vue pour récupérer les articles récents filtrés par catégorie (optionnel).
    """
    serializer_class = RSSFeedEntrySerializer

    def get_queryset(self):
        limit = int(self.request.query_params.get('limit', 30))
        category = self.request.query_params.get('category', None)

        queryset = RSSFeedEntry.objects.all().order_by('-published_at')
        if category:
            queryset = queryset.filter(feed__category__name__icontains=category)  # Filtrer par catégorie
        return queryset[:limit]


class ArticlePagination(PageNumberPagination):
    page_size = 10  # Nombre d'articles par page
    page_size_query_param = 'page_size'
    max_page_size = 50


from django.db.models import Q

class FeedArticlesView(generics.ListAPIView):
    """
    Vue pour lister les articles associés à un flux RSS avec pagination et recherche.
    """
    serializer_class = RSSFeedEntrySerializer
    pagination_class = ArticlePagination

    def get_queryset(self):
        feed_id = self.kwargs.get('feed_id')
        queryset = RSSFeedEntry.objects.filter(feed_id=feed_id).order_by('-published_at')
        
        # Ajouter une recherche simple
        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) | Q(content__icontains=search_term)
            )
        return queryset



class RSSFeedDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            feed = RSSFeed.objects.get(pk=pk)
            logger.debug(f"Flux trouvé : {feed.title}")
            articles = feed.entries.all()  # Articles associés
            logger.debug(f"Articles associés : {[article.title for article in articles]}")
            serializer = RSSFeedDetailSerializer(feed)
            return Response(serializer.data, status=200)
        except RSSFeed.DoesNotExist:
            logger.error(f"Flux avec ID {pk} introuvable")
            return Response({"error": "Flux RSS introuvable."}, status=404)



class RSSFeedListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister tous les flux RSS, les rechercher, les trier et en ajouter un nouveau.
    """
    queryset = RSSFeed.objects.all().order_by('-created_at')
    serializer_class = RSSFeedSerializer

    # Backends pour le filtrage, la recherche et le tri
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Champs pour la recherche et les filtres
    filterset_fields = ['category__name']  # Filtre par nom de catégorie
    search_fields = ['title', 'description', 'category__name']  # Recherche par titre, description ou catégorie
    ordering_fields = ['title', 'created_at']
    ordering = ['-created_at']  # Tri par défaut : date décroissante


    def post(self, request, *args, **kwargs):
        """
        Crée un nouveau flux RSS après validation.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class RSSFeedRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, modifier ou supprimer un flux RSS existant.
    """
    queryset = RSSFeed.objects.all()
    serializer_class = RSSFeedSerializer


class RSSFeedFilterView(APIView):
    """
    Vue pour filtrer les flux RSS par catégorie.
    """
    def get(self, request, *args, **kwargs):
        category = request.query_params.get('category', None)
        if category:
            queryset = RSSFeed.objects.filter(category__name__icontains=category)  # Recherche par catégorie exacte
            serializer = RSSFeedSerializer(queryset, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        return Response({"error": "Category not specified"}, status=HTTP_400_BAD_REQUEST)


class CategoryListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des catégories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer 


class CategoryDetailView(RetrieveAPIView):
    """
    Vue pour récupérer les détails d’une catégorie et les articles associés.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
