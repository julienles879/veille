from django.urls import path
from .views import *

urlpatterns = [
    path('', RSSFeedListCreateView.as_view(), name='rssfeed-list-create'),
    path('<int:pk>/', RSSFeedRetrieveUpdateDeleteView.as_view(), name='rssfeed-detail'),
    path('filter/', RSSFeedFilterView.as_view(), name='rssfeed-filter'),
    path('<int:pk>/detail/', RSSFeedDetailView.as_view(), name='rssfeed-detail'),
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path("categories/<int:pk>/delete/", CategoryDeleteView.as_view(), name="category-delete"),
    path('articles/recent/', RecentArticlesView.as_view(), name="recent-articles"),  # Nouvel endpoint
    path('articles/search/', ArticleSearchView.as_view(), name='article-search'),
    path('favorites/search/', FavoritesSearchView.as_view(), name='favorites-search'),
    path('categories/search/', CategorySearchView.as_view(), name='category-search'),
]
