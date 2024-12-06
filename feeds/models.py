from django.db import models

class RSSFeed(models.Model):
    """
    Modèle pour représenter un flux RSS.
    """
    title = models.CharField(max_length=255, help_text="Titre du flux RSS.")
    url = models.URLField(unique=True, help_text="URL du flux RSS.")
    description = models.TextField(null=True, blank=True, help_text="Description du flux RSS.")
    category = models.CharField(max_length=100, null=True, blank=True, help_text="Catégorie associée au flux RSS.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date d'ajout du flux RSS.")

    def __str__(self):
        return self.title
