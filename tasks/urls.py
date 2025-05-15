from django.urls import path
from .views import ManualRSSUpdateView, get_weather, get_city_from_coords

urlpatterns = [
    path('update-rss/', ManualRSSUpdateView.as_view(), name='manual-rss-update'),
    path("meteo/", get_weather, name="meteo"),
    path("meteo/localisation/", get_city_from_coords, name="get_city_from_coords"),
    path("manual-update/", ManualRSSUpdateView.as_view(), name="manual_update"),
]
