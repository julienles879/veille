from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from .models import *


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('article', 'created_at')  # Colonnes affichées
    search_fields = ('article__title', 'user__username')  # Barre de recherche sur titre d'article et utilisateur
    raw_id_fields = ['article']


@admin.register(RSSFeedEntry)
class RSSFeedEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_feed_title', 'get_feed_category', 'published_at', 'link')
    search_fields = ('title', 'feed__title', 'feed__category__name', 'link')
    list_filter = ('feed', 'feed__category', 'published_at')

    def get_feed_title(self, obj):
        """
        Retourne le titre du flux RSS auquel appartient l'article.
        """
        return obj.feed.title
    get_feed_title.short_description = 'Feed'  # Libellé de la colonne dans l'interface admin

    def get_feed_category(self, obj):
        """
        Retourne la catégorie du flux RSS auquel appartient l'article.
        """
        return obj.feed.category.name if obj.feed.category else "Aucune"
    get_feed_category.short_description = 'Catégorie'  # Libellé de la colonne dans l'interface admin
