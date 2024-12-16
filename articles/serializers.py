from rest_framework import serializers
from .models import *


class FavoriteSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour gérer les favoris.
    """
    article_title = serializers.CharField(source='article.title', read_only=True)
    article_link = serializers.URLField(source='article.link', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'article', 'article_title', 'article_link', 'created_at']
        read_only_fields = ['id', 'created_at', 'article_title', 'article_link']


class RSSFeedEntrySerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle RSSFeedEntry.
    Inclut les informations sur l'image de la catégorie associée.
    """
    feed_title = serializers.CharField(source='feed.title', read_only=True)  # Titre du flux RSS
    category_image = serializers.SerializerMethodField()  # Image de la catégorie

    class Meta:
        model = RSSFeedEntry
        fields = [
            'id',
            'feed',  # ID du flux RSS associé
            'feed_title',  # Titre du flux associé
            'title',
            'link',
            'content',
            'published_at',
            'category_image',  # Image de la catégorie (champ ajouté)
        ]
        read_only_fields = ['id', 'feed', 'feed_title', 'published_at']

    def get_category_image(self, obj):
        """
        Retourne une image aléatoire parmi celles associées à la catégorie de l'article.
        Si aucune catégorie ou image n'est associée, retourne None.
        """
        category = obj.feed.category if obj.feed and obj.feed.category else None
        if category and category.image:
            return category.image.url
        return None
