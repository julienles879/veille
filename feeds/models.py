from django.db import models

class Category(models.Model):
    """
    Modèle représentant une catégorie pour organiser les flux RSS et articles.
    """
    name = models.CharField(max_length=100, unique=True, help_text="Nom de la catégorie.")
    description = models.TextField(null=True, blank=True, help_text="Description de la catégorie.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date de création de la catégorie.")
    image = models.ImageField(upload_to='categories/', null=True, blank=True, help_text="Image associée à la catégorie.")

    def __str__(self):
        return self.name



class RSSFeed(models.Model):
    """
    Modèle pour représenter un flux RSS.
    """
    title = models.CharField(max_length=255, help_text="Titre du flux RSS.")
    url = models.URLField(unique=True, help_text="URL du flux RSS.")
    description = models.TextField(null=True, blank=True, help_text="Description du flux RSS.")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="feeds", help_text="Catégorie associée au flux RSS.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date d'ajout du flux RSS.")

    def __str__(self):
        return self.title