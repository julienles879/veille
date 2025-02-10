from django.db import models
from django.conf import settings  
from django.utils.timezone import now
from feeds.models import RSSFeed


class RSSFeedEntry(models.Model):
    """
    Modèle représentant un article extrait d'un flux RSS.
    """
    feed = models.ForeignKey(
        RSSFeed, 
        on_delete=models.CASCADE, 
        related_name='entries', 
        help_text="Flux RSS associé à cet article."
    )
    title = models.CharField(max_length=255, help_text="Titre de l'article.")
    link = models.URLField(help_text="Lien vers l'article.")
    content = models.TextField(null=True, blank=True, help_text="Contenu de l'article.")
    published_at = models.DateTimeField(default=now, help_text="Date de publication de l'article.")

    def __str__(self):
        return self.title
    
class Favorite(models.Model):
    """
    Modèle pour gérer les favoris des articles.
    """

    article = models.ForeignKey(
        RSSFeedEntry, 
        on_delete=models.CASCADE,
        related_name="favorited_by",
        help_text="Article marqué comme favori."
    )
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date à laquelle l'article a été ajouté aux favoris.")

    class Meta:
        ordering = ['-created_at']  # Tri par date d'ajout décroissante

    def __str__(self):
        return f"{self.article.title} - {self.created_at}"
