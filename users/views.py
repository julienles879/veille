from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from django.contrib.auth.mixins import LoginRequiredMixin

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({'error': 'username et password requis.'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Cet utilisateur existe déjà.'}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            user.is_active = False  # Important : le compte doit être validé par l'admin
            user.save()

            return JsonResponse({'success': 'Compte créé. En attente de validation par un admin.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is None:
                return JsonResponse({'error': 'Identifiants invalides.'}, status=401)

            if not user.is_active:
                return JsonResponse({'error': 'Compte non activé. Veuillez attendre la validation par un admin.'}, status=403)

            login(request, user)
            return JsonResponse({'success': 'Connexion réussie.', 'username': user.username})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(LoginRequiredMixin, View):
    def post(self, request):
        logout(request)
        return JsonResponse({'success': 'Déconnexion réussie.'})

@method_decorator(csrf_exempt, name='dispatch')
class UpdateProfileView(LoginRequiredMixin, View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Non authentifié.'}, status=401)

        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if email:
                request.user.email = email

            if password:
                request.user.set_password(password)

            request.user.save()

            return JsonResponse({'success': 'Profil mis à jour.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
