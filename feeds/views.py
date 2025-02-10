from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import *
from .serializers import *
from articles.serializers import *
from articles.models import *
import logging

logger = logging.getLogger(__name__)


### Pagination pour le Scroll Infini ###
class InfiniteScrollPagination(PageNumberPagination):
    page_size = 20  # Nombre d'articles par page par défaut
    page_size_query_param = 'page_size'
    max_page_size = 100


### Recherche d'Articles ###
class ArticleSearchView(generics.ListAPIView):
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'content', 'feed__title']
    ordering_fields = ['title', 'published_at']
    ordering = ['-published_at']
    filterset_fields = ['feed__category__name']

    def get_queryset(self):
        return RSSFeedEntry.objects.all()


### Recherche et tri des articles favoris ###
class FavoritesSearchView(generics.ListAPIView):
    serializer_class = RSSFeedEntrySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'feed__title']
    ordering_fields = ['published_at', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        return RSSFeedEntry.objects.filter(favorited_by__isnull=False).order_by('-published_at')


### Liste des Articles avec Scroll Infini ###
class RecentArticlesView(generics.ListAPIView):
    serializer_class = RSSFeedEntrySerializer
    pagination_class = InfiniteScrollPagination  # Activation du Scroll Infini

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        queryset = RSSFeedEntry.objects.all().order_by('-published_at')

        if category:
            queryset = queryset.filter(feed__category__name__icontains=category)
        return queryset


### Liste des articles d'un Flux RSS ###
class FeedArticlesView(generics.ListAPIView):
    serializer_class = RSSFeedEntrySerializer
    pagination_class = InfiniteScrollPagination

    def get_queryset(self):
        feed_id = self.kwargs.get('feed_id')
        queryset = RSSFeedEntry.objects.filter(feed_id=feed_id).order_by('-published_at')

        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(Q(title__icontains=search_term) | Q(content__icontains=search_term))
        return queryset


### Détails d'un Flux RSS ###
class RSSFeedDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            feed = RSSFeed.objects.get(pk=pk)
            articles = feed.entries.all()
            serializer = RSSFeedDetailSerializer(feed)
            return Response(serializer.data, status=HTTP_200_OK)
        except RSSFeed.DoesNotExist:
            return Response({"error": "Flux RSS introuvable."}, status=HTTP_404_NOT_FOUND)


### Liste et Création de Flux RSS ###
class RSSFeedListCreateView(generics.ListCreateAPIView):
    queryset = RSSFeed.objects.all().order_by('-created_at')
    serializer_class = RSSFeedSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name']
    search_fields = ['title', 'description', 'category__name']
    ordering_fields = ['title', 'created_at']
    ordering = ['-created_at']


### Gestion des Catégories ###
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


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