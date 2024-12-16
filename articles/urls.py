from django.urls import path
from .views import *

urlpatterns = [
    path('', RSSFeedEntryListView.as_view(), name='rssfeedentry-list'),
    path('<int:pk>/', RSSFeedEntryDetailView.as_view(), name='rssfeedentry-detail'),
    path('filter/', RSSFeedEntryFilterView.as_view(), name='rssfeedentry-filter'),
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/add/', AddFavoriteView.as_view(), name='add-favorite'),
    path('favorites/remove/<int:article_id>/', RemoveFavoriteView.as_view(), name='remove-favorite'),
]
