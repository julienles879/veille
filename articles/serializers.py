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
    Inclut les informations sur les favoris.
    """
    feed_title = serializers.CharField(source='feed.title', read_only=True)
    category = serializers.CharField(source='feed.category.name', read_only=True)
    published_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    is_favorite = serializers.SerializerMethodField()  # Champ pour vérifier si en favori

    class Meta:
        model = RSSFeedEntry
        fields = [
            'id',
            'feed',
            'feed_title',
            'category',
            'title',
            'link',
            'content',
            'published_at',
            'is_favorite',  # Ajout du champ pour vérifier si en favori
        ]

    def get_is_favorite(self, obj):
        """
        Retourne True si l'article est marqué comme favori (indépendamment d'un utilisateur).
        """
        return Favorite.objects.filter(article=obj).exists()


    def get_category_image(self, obj):
        """
        Retourne une image aléatoire parmi celles associées à la catégorie de l'article.
        Si aucune catégorie ou image n'est associée, retourne None.
        """
        category = obj.feed.category if obj.feed and obj.feed.category else None
        if category and category.image:
            return category.image.url
        return None
