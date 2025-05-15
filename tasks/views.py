from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from articles.tasks import fetch_articles_for_feeds

import requests
from rest_framework.decorators import api_view
from django.conf import settings


class ManualRSSUpdateView(APIView):
    """
    Vue pour déclencher manuellement la récupération des flux RSS.
    """
    def post(self, request, *args, **kwargs):
        try:
            fetch_articles_for_feeds()
            return Response({"message": "Mise à jour des flux RSS déclenchée avec succès."}, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_weather(request):
    """
    Vue API pour obtenir la météo actuelle via Météo Concept, par nom de ville ou coord GPS.
    """
    city = request.GET.get("city")
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")
    token = settings.METEO_CONCEPT_TOKEN

    try:
        if lat and lon:
            location_res = requests.get(
                "https://api.meteo-concept.com/api/location/cities",
                params={"token": token, "lat": lat, "lon": lon}
            )
        else:
            location_res = requests.get(
                "https://api.meteo-concept.com/api/location/cities",
                params={"token": token, "search": city or "Paris", "limit": 1}
            )

        location_res.raise_for_status()
        location_data = location_res.json()

        cities = location_data.get("cities")
        if not cities:
            return Response({"error": "Aucune ville trouvée."}, status=HTTP_500_INTERNAL_SERVER_ERROR)

        city_data = cities[0]
        city_id = city_data["insee"]
        city_name = city_data["name"]

        weather_res = requests.get(
            "https://api.meteo-concept.com/api/forecast/daily/0",
            params={"token": token, "insee": city_id}
        )
        weather_res.raise_for_status()
        weather_data = weather_res.json()
        forecast = weather_data["forecast"]

        return Response({
            "city": city_name,
            "tmin": forecast["tmin"],
            "tmax": forecast["tmax"],
            "weather": forecast["weather"],
            "datetime": forecast["datetime"]
        }, status=HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_city_from_coords(request):
    """
    Vue API qui renvoie uniquement le nom de la ville à partir de lat/lon.
    """
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")
    token = settings.METEO_CONCEPT_TOKEN

    if not lat or not lon:
        return Response({"error": "Latitude et longitude requises."}, status=400)

    try:
        location_res = requests.get(
            "https://api.meteo-concept.com/api/location/cities",
            params={"token": token, "lat": lat, "lon": lon}
        )
        location_res.raise_for_status()
        data = location_res.json()

        if not data.get("cities"):
            return Response({"error": "Aucune ville trouvée."}, status=404)

        city_name = data["cities"][0]["name"]
        return Response({"city": city_name}, status=HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)



class ManualRSSUpdateView(APIView):
    """
    Vue pour déclencher manuellement la récupération des flux RSS.
    """
    def post(self, request, *args, **kwargs):
        try:
            # Appelle la tâche qui synchronise les articles
            fetch_articles_for_feeds()
            return Response({"message": "Mise à jour des flux RSS déclenchée avec succès."}, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
