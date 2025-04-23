from django.http import JsonResponse, HttpResponse
from django.views.generic import View

class FrontendAppView(View):
    def get(self, request):
        try:
            with open('/app/veille/staticfiles/frontend/index.html') as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("Build not found", status=501)

def custom_404(request, exception=None):
    return JsonResponse({'error': 'Page non trouvée'}, status=404)

def custom_500(request):
    return JsonResponse({'error': 'Erreur interne du serveur'}, status=500)
