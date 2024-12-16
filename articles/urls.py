from django.urls import path
from .views import (
    RSSFeedEntryListView,
    RSSFeedEntryDetailView,
    RSSFeedEntryFilterView,
)

urlpatterns = [
    path('', RSSFeedEntryListView.as_view(), name='rssfeedentry-list'),
    path('<int:pk>/', RSSFeedEntryDetailView.as_view(), name='rssfeedentry-detail'),
    path('filter/', RSSFeedEntryFilterView.as_view(), name='rssfeedentry-filter'),
]
