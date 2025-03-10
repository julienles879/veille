from django.db import models
from django.conf import settings  
from feeds.models import RSSFeed
from taggit.managers import TaggableManager

from django.db import models
from django.utils.timezone import now
from feeds.models import RSSFeed
from django.db import models

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
    published_at = models.DateTimeField(help_text="Date de publication de l'article.", null = True, blank = True)  # ✅ Modifié
    last_viewed_at = models.DateTimeField(null=True, blank=True, help_text="Dernière consultation de l'article.")  # ✅ Ajouté
    tags = TaggableManager(blank=True)
    def update_last_viewed(self):
        """Met à jour la date de dernière consultation"""
        self.last_viewed_at = now()
        self.save()

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
