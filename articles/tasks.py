import feedparser
from datetime import datetime
from background_task import background
from .models import RSSFeedEntry
from feeds.models import RSSFeed

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
