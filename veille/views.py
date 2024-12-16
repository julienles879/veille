from django.http import JsonResponse

def custom_404(request, exception=None):
    return JsonResponse({'error': 'Page non trouvée'}, status=404)

def custom_500(request):
    return JsonResponse({'error': 'Erreur interne du serveur'}, status=500)
