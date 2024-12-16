from rest_framework import serializers
from .models import RSSFeed, Category
from articles.models import RSSFeedEntry
from articles.serializers import RSSFeedEntrySerializer


class RSSFeedSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)  # Nom de la catégorie

    class Meta:
        model = RSSFeed
        fields = ['id', 'title', 'url', 'description', 'category', 'category_name', 'created_at']
        read_only_fields = ['id', 'created_at']  # Ces champs ne sont pas modifiables

    def validate_url(self, value):
        """
        Valide que l'URL est unique dans la base de données.
        """
        if RSSFeed.objects.filter(url=value).exists():
            raise serializers.ValidationError("Un flux RSS avec cette URL existe déjà.")
        return value

    def validate_category(self, value):
        """
        Valide que la catégorie associée existe.
        """
        if not Category.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("La catégorie spécifiée n'existe pas.")
        return value



class RSSFeedDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    articles = RSSFeedEntrySerializer(many=True, read_only=True, source='entries')  # Utilise 'entries' du related_name

    class Meta:
        model = RSSFeed
        fields = ['id', 'title', 'url', 'description', 'category', 'category_name', 'created_at', 'articles']

class CategorySerializer(serializers.ModelSerializer):
    articles = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'articles']
        read_only_fields = ['id', 'created_at']
 
    def get_articles(self, obj):
        """
        Récupère les articles associés à ce flux RSS.
        """
        articles = RSSFeedEntry.objects.filter(feed=obj).order_by('-published_at')
        return RSSFeedEntrySerializer(articles, many=True).data
