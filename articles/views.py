from rest_framework import generics, filters
from .models import RSSFeedEntry
from .serializers import RSSFeedEntrySerializer

from rest_framework.generics import ListAPIView
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import RSSFeedEntry
from .serializers import RSSFeedEntrySerializer

class RSSFeedEntryListView(generics.ListAPIView):
    """
    Vue pour lister, filtrer et trier les articles.
    """
    queryset = RSSFeedEntry.objects.all()
    serializer_class = RSSFeedEntrySerializer

    # Ajout des filtres et du tri
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['feed__category__name', 'feed__title']  # Filtrage par catégorie et flux
    ordering_fields = ['published_at', 'title']  # Tri par date de publication ou titre
    ordering = ['-published_at']  # Tri par défaut : plus récent en premier



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
