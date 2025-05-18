from django.db import models
from django.conf import settings

class Category(models.Model):
    """
    Modèle représentant une catégorie pour organiser les flux RSS et articles.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
        null=True, blank=True,
        help_text="Utilisateur propriétaire de la catégorie (null = catégorie globale)."
    )
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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='rss_feeds', 
        help_text="Utilisateur qui a propriétaire le flux RSS."
    )
    title = models.CharField(max_length=255, help_text="Titre du flux RSS.")
    url = models.URLField(unique=True, help_text="URL du flux RSS.")
    description = models.TextField(null=True, blank=True, help_text="Description du flux RSS.")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="feeds", help_text="Catégorie associée au flux RSS.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date d'ajout du flux RSS.")
    is_public = models.BooleanField(default=False, help_text="Indique si le flux RSS est public ou privé.")

    def __str__(self):
        return self.title
    
    
class UserRSSFeed(models.Model):
    """
    Association entre un utilisateur et un flux RSS (abonnement personnel).
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_rss_feeds",
        help_text="Utilisateur abonné au flux RSS."
    )
    feed = models.ForeignKey(
        'RSSFeed',
        on_delete=models.CASCADE,
        related_name="subscribers",
        help_text="Flux RSS auquel l'utilisateur est abonné."
    )
    added_at = models.DateTimeField(auto_now_add=True, help_text="Date d'ajout du flux par l'utilisateur.")

    class Meta:
        unique_together = ('user', 'feed')  # Un utilisateur ne peut ajouter le même flux qu'une fois

    def __str__(self):
        return f"{self.user.username} → {self.feed.title}"
    