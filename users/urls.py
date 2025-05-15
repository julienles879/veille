from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UpdateProfileView, ProfileDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profile/update/', UpdateProfileView.as_view(), name='profile-update'),
]
