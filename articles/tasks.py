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



from django.utils.timezone import now

@background(schedule=10)
def fetch_articles_for_feeds():
    repeat_time = 2 * 60  # 🔄 Répéter toutes les 2 minutes

    feeds = RSSFeed.objects.all()
    for feed in feeds:
        parsed_feed = feedparser.parse(feed.url)

        if parsed_feed.bozo:
            print(f"🚨 Erreur lors du parsing du flux : {feed.url}")
            continue

        for entry in parsed_feed.entries:
            if RSSFeedEntry.objects.filter(link=entry.link).exists():
                continue

            # 🛠️ Vérifie si la date de publication est disponible
            published_at = (
                datetime(*entry.published_parsed[:6])
                if hasattr(entry, "published_parsed")
                else now()  # ✅ Utilise la date actuelle si absente
            )

            RSSFeedEntry.objects.create(
                feed=feed,
                title=entry.title,
                link=entry.link,
                content=entry.get("summary", ""),
                published_at=published_at,  # ✅ Toujours une valeur
            )
            print(f"✅ Article ajouté : {entry.title} - {published_at}")

    fetch_articles_for_feeds(repeat=repeat_time)
