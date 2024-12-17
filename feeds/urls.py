from django.urls import path
from .views import *

urlpatterns = [
    path('', RSSFeedListCreateView.as_view(), name='rssfeed-list-create'),
    path('<int:pk>/', RSSFeedRetrieveUpdateDeleteView.as_view(), name='rssfeed-detail'),
    path('filter/', RSSFeedFilterView.as_view(), name='rssfeed-filter'),
    path('<int:pk>/detail/', RSSFeedDetailView.as_view(), name='rssfeed-detail'),
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path('feeds/<int:feed_id>/articles/', FeedArticlesView.as_view(), name="feed-articles"),
]
