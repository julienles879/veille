from rest_framework import generics, filters
from .models import RSSFeedEntry
from .serializers import RSSFeedEntrySerializer

class RSSFeedEntryListView(generics.ListAPIView):
    """
    Vue pour lister tous les articles avec pagination, recherche et filtres.
    """
    queryset = RSSFeedEntry.objects.all().order_by('-published_at')
    serializer_class = RSSFeedEntrySerializer

    # Filtres pour la recherche et les filtres personnalisés
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']  # Recherche textuelle
    ordering_fields = ['published_at', 'title']  # Tri possible


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
