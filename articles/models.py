from django.db import models
from feeds.models import RSSFeed

class RSSFeedEntry(models.Model):
    """
    Modèle pour représenter les articles extraits des flux RSS.
    """
    feed = models.ForeignKey(RSSFeed, on_delete=models.CASCADE, related_name="entries", help_text="Flux RSS associé à cet article.")
    title = models.CharField(max_length=255, help_text="Titre de l'article.")
    link = models.URLField(unique=True, help_text="Lien vers l'article original.")
    content = models.TextField(null=True, blank=True, help_text="Résumé ou contenu de l'article.")
    published_at = models.DateTimeField(help_text="Date de publication de l'article.")

    def __str__(self):
        return f"{self.title} ({self.feed.title})"
