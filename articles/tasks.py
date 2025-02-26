import feedparser
from datetime import datetime, timedelta
from django.utils.timezone import now
from background_task import background
from .models import *

@background(schedule=3600)  # 🔥 Exécution toutes les heures
def delete_old_articles():
    """
    Supprime les articles publiés il y a plus d'une heure, sauf ceux qui sont en favoris
    ou qui sont encore affichés par un utilisateur.
    """
    cutoff_time = now() - timedelta(hours=1)  # 🔥 Articles plus vieux d'une heure

    # Récupère les IDs des articles favoris pour les exclure
    favorite_article_ids = Favorite.objects.values_list('article_id', flat=True)

    # Articles encore affichés par un utilisateur
    displayed_article_ids = RSSFeedEntry.objects.filter(last_viewed_at__gte=cutoff_time).values_list('id', flat=True)

    # Supprime les articles anciens qui ne sont ni en favoris ni affichés
    old_articles = RSSFeedEntry.objects.filter(
        published_at__lt=cutoff_time
    ).exclude(id__in=favorite_article_ids).exclude(id__in=displayed_article_ids)

    deleted_count, _ = old_articles.delete()
    print(f"🗑️ {deleted_count} articles supprimés (publiés avant {cutoff_time}, hors favoris et affichés)")

    # Replanifier la tâche toutes les heures
    delete_old_articles(repeat=3600)



@background(schedule=10)
def fetch_articles_for_feeds():
    """
    Tâche pour récupérer les articles des flux RSS.
    """
    # Délai de répétition défini en dur (par exemple, toutes les 2 minutes)
    repeat_time = 2 * 60  # 2 minutes

    feeds = RSSFeed.objects.all()
    for feed in feeds:
        parsed_feed = feedparser.parse(feed.url)
        if parsed_feed.bozo:  # Vérifie si le flux est valide
            print(f"Erreur lors du parsing du flux : {feed.url}")
            continue

        for entry in parsed_feed.entries:
            # Vérifie si l'article existe déjà
            if RSSFeedEntry.objects.filter(link=entry.link).exists():
                continue

            # Ajouter l'article à la base de données
            RSSFeedEntry.objects.create(
                feed=feed,
                title=entry.title,
                link=entry.link,
                content=entry.get("summary", ""),  # Récupère le résumé si disponible
                published_at=datetime(*entry.published_parsed[:6]) if "published_parsed" in entry else None
            )
            print(f"Article ajouté : {entry.title}")

    # Planifier la tâche à nouveau avec le délai fixé
    fetch_articles_for_feeds(repeat=repeat_time)
