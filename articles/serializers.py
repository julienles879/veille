import re
import html
import os
import random
from django.conf import settings
from rest_framework import serializers
from taggit.serializers import TaggitSerializer, TagListSerializerField 
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
    feed_title = serializers.CharField(source='feed.title', read_only=True)
    category = serializers.CharField(source='feed.category.name', read_only=True)
    published_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    image = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()  # Ajout du traitement du contenu

    class Meta:
        model = RSSFeedEntry
        fields = [
            'id',
            'feed',
            'feed_title',
            'category',
            'title',
            'link',
            'content',       # Remplacé par le champ calculé
            'published_at',
            'image',
            'tags',
        ]
        read_only_fields = ['id', 'feed', 'feed_title', 'category', 'published_at', 'image']

    def get_content(self, obj):
        """
        Décodage des entités HTML pour affichage propre.
        """
        if not obj.content:
            return ""
    
        # Étape 1 : décoder les entités HTML (&eacute; -> é)
        decoded = html.unescape(obj.content)

        # Étape 2 : supprimer toutes les balises HTML
        clean_text = re.sub(r'<[^>]+>', '', decoded)

        return clean_text.strip()

        
    def get_tags(self, obj):
        exclude = {
            'class', 'autobr', 'href', 'https', 'br', 'img', 'span', 'src', 'rel', 'nofollow',
            'directory', 'tag', 'title', 'content', 'html', 'meta', 'link', 'stylesheet',
            'button', 'text', 'css', 'container', 'type', 'value', 'name', 'id', 'div'
        }
        return [tag.name for tag in obj.tags.all() if tag.name.lower() not in exclude]
        

    def get_image(self, obj):
        # 1. Image attachée à l'article
        if hasattr(obj, 'image') and obj.image:
            return obj.image.url

        # 2. Image aléatoire depuis le dossier de la catégorie
        if obj.feed and obj.feed.category:
            category_slug = obj.feed.category.name.lower().replace(" ", "_")
            category_path = os.path.join(settings.MEDIA_ROOT, 'images', 'categorie', category_slug)

            if os.path.isdir(category_path):
                images = [f for f in os.listdir(category_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                if images:
                    chosen = random.choice(images)
                    return f"{settings.MEDIA_URL}images/categorie/{category_slug}/{chosen}"

        # 3. Extraction via contenu HTML
        if obj.content:
            match = re.search(r'<img[^>]+src=["\'](.*?)["\']', obj.content)
            if match:
                return match.group(1)

        # 4. Aucun fallback
        return None
