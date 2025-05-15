from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'username et password requis.'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Cet utilisateur existe déjà.'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_active = True    # ✅ facultatif : active directement si pas de validation admin
        token, _ = Token.objects.get_or_create(user=user)

        return Response({'success': 'Compte créé.', 'token': token.key}, status=201)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({'error': 'Identifiants invalides.'}, status=401)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'success': 'Connexion réussie.', 'token': token.key}, status=200)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()   # ✅ supprime le token de l’utilisateur
        return Response({'success': 'Déconnexion réussie.'}, status=200)

class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'username': request.user.username,
            'email': request.user.email,
        })

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if email:
            request.user.email = email
        if password:
            request.user.set_password(password)

        request.user.save()
        return Response({'success': 'Profil mis à jour.'}, status=200)
