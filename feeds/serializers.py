from rest_framework import serializers
from .models import RSSFeed

class RSSFeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSSFeed
        fields = ['id', 'title', 'url', 'description', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']  # Ces champs ne sont pas modifiables

    def validate_url(self, value):
        """
        Valide que l'URL est unique dans la base de données.
        """
        if RSSFeed.objects.filter(url=value).exists():
            raise serializers.ValidationError("Un flux RSS avec cette URL existe déjà.")
        return value
