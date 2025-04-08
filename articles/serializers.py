import re
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
    image = serializers.SerializerMethodField()  # ✅ Champ image dynamique
    tags = serializers.SerializerMethodField()

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
            'image',  # ✅ Image incluse
            'tags',
        ]
        read_only_fields = ['id', 'feed', 'feed_title', 'category', 'published_at', 'image']
        
    def get_tags(self, obj):
        exclude = {
            'class', 'autobr', 'href', 'https', 'br', 'img', 'span', 'src', 'rel', 'nofollow',
            'directory', 'tag', 'title', 'content', 'html', 'meta', 'link', 'stylesheet',
            'button', 'text', 'css', 'container', 'type', 'value', 'name', 'id', 'div'
        }
        return [tag.name for tag in obj.tags.all() if tag.name.lower() not in exclude]
        

    def get_image(self, obj):
        """
        Récupère l'image depuis obj.image, la catégorie ou extrait depuis le content si nécessaire.
        """
        # ✅ 1. Si l'image est stockée directement dans l'objet
        if hasattr(obj, 'image') and obj.image:
            return obj.image.url

        # ✅ 2. Si une image est liée à la catégorie
        category = obj.feed.category if obj.feed and obj.feed.category else None
        if category and category.image:
            return category.image.url

        # ✅ 3. Extraire l'image du champ content via regex
        if obj.content:
            match = re.search(r'<img.*?src="(.*?)"', obj.content)
            if match:
                return match.group(1)  # L'URL de l'image extraite

        # 🔴 4. Aucune image trouvée
        return None
