from rest_framework import serializers
from .models import RSSFeedEntry

class RSSFeedEntrySerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle RSSFeedEntry.
    """
    feed_title = serializers.CharField(source='feed.title', read_only=True)

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
        ]
        read_only_fields = ['id', 'feed', 'feed_title', 'published_at']
