from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.timezone import now
from .models import *
from .serializers import *


class UpdateLastViewedView(APIView):
    """
    Vue pour mettre à jour la dernière consultation d'un article.
    """
    def post(self, request, *args, **kwargs):
        article_id = request.data.get("article_id")
        if not article_id:
            return Response({"error": "Article ID is required."}, status=HTTP_404_NOT_FOUND)
        try:
            article = RSSFeedEntry.objects.get(id=article_id)
            article.update_last_viewed()  # ✅ Met à jour last_viewed_at
            return Response({"message": "Dernière consultation mise à jour."}, status=HTTP_200_OK)
        except RSSFeedEntry.DoesNotExist:
            return Response({"error": "Article not found."}, status=HTTP_404_NOT_FOUND)


class FavoriteListView(APIView):
    """
    Vue pour lister les favoris.
    """
    def get(self, request):
        favorites = Favorite.objects.all()
        articles = [favorite.article for favorite in favorites]
        serializer = RSSFeedEntrySerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddFavoriteView(APIView):
    """
    Vue pour ajouter un favori.
    """
    def post(self, request, *args, **kwargs):
        article_id = request.data.get('article_id')
        if not article_id:
            return Response({"error": "Article ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            article = RSSFeedEntry.objects.get(id=article_id)
            favorite, created = Favorite.objects.get_or_create(article=article)
            if created:
                return Response({"message": "Article added to favorites."}, status=status.HTTP_201_CREATED)
            return Response({"message": "Article is already a favorite."}, status=status.HTTP_200_OK)
        except RSSFeedEntry.DoesNotExist:
            return Response({"error": "Article not found."}, status=status.HTTP_404_NOT_FOUND)

class RemoveFavoriteView(APIView):
    """
    Vue pour supprimer un favori.
    """
    def delete(self, request, *args, **kwargs):
        article_id = kwargs.get('article_id')
        try:
            favorite = Favorite.objects.get(article_id=article_id)
            favorite.delete()
            return Response({"message": "Article removed from favorites."}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({"error": "Favorite not found."}, status=status.HTTP_404_NOT_FOUND)


class RSSFeedEntryListView(generics.ListAPIView):
    """
    Vue pour lister, filtrer, trier et rechercher les articles.
    """
    queryset = RSSFeedEntry.objects.all()
    serializer_class = RSSFeedEntrySerializer

    # Backends pour le filtrage, le tri et la recherche
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    
    # Champs pour le filtrage
    filterset_fields = ['feed__category__name', 'feed__title']
    
    # Champs pour le tri
    ordering_fields = ['published_at', 'title']
    ordering = ['-published_at']  # Par défaut, tri par date décroissante
    
    # Champs pour la recherche
    search_fields = ['title', 'content', 'feed__category__name']



class RSSFeedEntryDetailView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les détails d’un article spécifique.
    """
    queryset = RSSFeedEntry.objects.all()
    serializer_class = RSSFeedEntrySerializer


class RSSFeedEntryFilterView(generics.ListAPIView):
    """
    Vue pour filtrer les articles par flux RSS, catégorie ou période.
    """
    serializer_class = RSSFeedEntrySerializer

    def get_queryset(self):
        queryset = RSSFeedEntry.objects.all()
        feed_id = self.request.query_params.get('feed', None)
        category = self.request.query_params.get('category', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        # Filtrage par flux RSS
        if feed_id:
            queryset = queryset.filter(feed_id=feed_id)

        # Filtrage par catégorie (via le modèle RSSFeed)
        if category:
            queryset = queryset.filter(feed__category__icontains=category)

        # Filtrage par période
        if start_date and end_date:
            queryset = queryset.filter(published_at__range=[start_date, end_date])

        return queryset
