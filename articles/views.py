from rest_framework import generics, filters
from .models import RSSFeedEntry
from .serializers import RSSFeedEntrySerializer

from rest_framework.generics import ListAPIView
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import RSSFeedEntry
from .serializers import RSSFeedEntrySerializer
from rest_framework.filters import SearchFilter

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
