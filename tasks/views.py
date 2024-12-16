from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from articles.tasks import fetch_articles_for_feeds

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
