from django.contrib import admin
from .models import *

@admin.register(RSSFeed)
class RSSFeedAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle RSSFeed.
    """
    # Champs affichés dans la liste
    list_display = ('title', 'url', 'category', 'created_at')
    
    # Champs cliquables pour accéder aux détails
    list_display_links = ('title',)
    
    # Champs de recherche
    search_fields = ('title', 'url', 'category')
    
    # Options de filtrage
    list_filter = ('category', 'created_at')
    
    # Champs non modifiables
    readonly_fields = ('created_at',)



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)