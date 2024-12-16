from django.urls import path
from .views import *

urlpatterns = [
    path('', RSSFeedListCreateView.as_view(), name='rssfeed-list-create'),
    path('<int:pk>/', RSSFeedRetrieveUpdateDeleteView.as_view(), name='rssfeed-detail'),
    path('filter/', RSSFeedFilterView.as_view(), name='rssfeed-filter'),
    path('<int:pk>/detail/', RSSFeedDetailView.as_view(), name='rssfeed-detail'),
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),  # Route unique pour les catégories
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
]
