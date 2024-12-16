from django.urls import path
from .views import ManualRSSUpdateView

urlpatterns = [
    path('update-rss/', ManualRSSUpdateView.as_view(), name='manual-rss-update'),
]
