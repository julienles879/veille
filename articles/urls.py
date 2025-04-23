from django.urls import path, re_path
from .views import ReactAppView
from .views import *
from .views_stats import stats_articles

urlpatterns = [
    path('', RSSFeedEntryListView.as_view(), name='rssfeedentry-list'),
    path('<int:pk>/', RSSFeedEntryDetailView.as_view(), name='rssfeedentry-detail'),
    path('filter/', RSSFeedEntryFilterView.as_view(), name='rssfeedentry-filter'),
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/add/', AddFavoriteView.as_view(), name='add-favorite'),
    path('favorites/remove/<int:article_id>/', RemoveFavoriteView.as_view(), name='remove-favorite'),
    
    path("stats/", stats_articles, name="stats_articles"),
    
    re_path(r"^.*$", ReactAppView.as_view(), name="react"),
]
