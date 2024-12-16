from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# Enregistrer le modèle User dans l'interface admin
admin.site.register(User, UserAdmin)
