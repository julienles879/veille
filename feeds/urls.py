from django.urls import path
from .views import RSSFeedListCreateView, RSSFeedRetrieveUpdateDeleteView, RSSFeedFilterView

urlpatterns = [
    path('', RSSFeedListCreateView.as_view(), name='rssfeed-list-create'),
    path('<int:pk>/', RSSFeedRetrieveUpdateDeleteView.as_view(), name='rssfeed-detail'),
    path('filter/', RSSFeedFilterView.as_view(), name='rssfeed-filter'),
]
