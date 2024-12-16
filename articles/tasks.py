import feedparser
from datetime import datetime
from background_task import background
from tasks.models import TaskConfiguration
from .models import RSSFeedEntry
from feeds.models import RSSFeed

@background(schedule=10)
def fetch_articles_for_feeds():
    """
    Tâche pour récupérer les articles des flux RSS.
    """
    # Charger la configuration
    try:
        config = TaskConfiguration.objects.get(task_name='fetch_articles_for_feeds')
        repeat_time = config.repeat_time
    except TaskConfiguration.DoesNotExist:
        repeat_time = 120  # Valeur par défaut si la configuration n'existe pas

    feeds = RSSFeed.objects.all()
    for feed in feeds:
        parsed_feed = feedparser.parse(feed.url)
        if parsed_feed.bozo:
            print(f"Erreur lors du parsing du flux : {feed.url}")
            continue

        for entry in parsed_feed.entries:
            if RSSFeedEntry.objects.filter(link=entry.link).exists():
                continue

            RSSFeedEntry.objects.create(
                feed=feed,
                title=entry.title,
                link=entry.link,
                content=entry.get("summary", ""),
                published_at=datetime(*entry.published_parsed[:6]) if "published_parsed" in entry else None
            )
            print(f"Article ajouté : {entry.title}")

    # Planifier la prochaine exécution
    fetch_articles_for_feeds(repeat=repeat_time)
