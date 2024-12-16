from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from .models import RSSFeed, Category
from .serializers import RSSFeedSerializer, CategorySerializer


class RSSFeedListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister tous les flux RSS, les rechercher, les trier et en ajouter un nouveau.
    """
    queryset = RSSFeed.objects.all().order_by('-created_at')  # Tri par défaut : plus récent en premier
    serializer_class = RSSFeedSerializer

    # Backends pour le filtrage, la recherche et le tri
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Champs pour la recherche
    search_fields = ['title', 'description', 'category__name']  # Recherche par titre, description ou catégorie

    # Champs pour le tri
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


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer une catégorie.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
