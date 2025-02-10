import feedparser
import dateutil.parser  # 🔹 Pour parser les dates de manière robuste
from datetime import datetime
from django.utils import timezone
from background_task import background
from .models import RSSFeedEntry
from feeds.models import RSSFeed

@background(schedule=10)
def fetch_articles_for_feeds():
    """
    Tâche pour récupérer les articles des flux RSS.
    """
    repeat_time = 2 * 60  # 2 minutes

    feeds = RSSFeed.objects.all()
    for feed in feeds:
        parsed_feed = feedparser.parse(feed.url)
        if parsed_feed.bozo:  # Vérifie si le flux est valide
            print(f"⚠️ Erreur lors du parsing du flux : {feed.url}")
            continue

        for entry in parsed_feed.entries:
            # Vérifie si l'article existe déjà
            if RSSFeedEntry.objects.filter(link=entry.link).exists():
                continue

            # 🔍 1️⃣ Récupération de la date
            published_date = None
            if "published" in entry:
                try:
                    published_date = dateutil.parser.parse(entry["published"])
                except (ValueError, TypeError):
                    print(f"⚠️ Erreur parsing `published` pour {entry.get('title', 'Sans titre')}")
            elif "dc:date" in entry:
                try:
                    published_date = dateutil.parser.parse(entry["dc:date"])
                except (ValueError, TypeError):
                    print(f"⚠️ Erreur parsing `dc:date` pour {entry.get('title', 'Sans titre')}")

            # 🔹 2️⃣ Si la date est toujours None, on met la date actuelle
            if not published_date:
                print(f"⚠️ Aucun `published_at` trouvé pour '{entry.get('title', 'Sans titre')}', utilisation de `timezone.now()`")
                published_date = timezone.now()

            # 🔹 3️⃣ Ajout de l'article à la base de données
            RSSFeedEntry.objects.create(
                feed=feed,
                title=entry.get("title", "Sans titre"),
                link=entry.get("link", "#"),
                content=entry.get("summary", ""),  # Récupère le résumé si disponible
                published_at=published_date  # ✅ Toujours défini !
            )
            print(f"✅ Article ajouté : {entry.get('title', 'Sans titre')}")

    # Planifier la tâche à nouveau avec le délai fixé
    fetch_articles_for_feeds(repeat=repeat_time) 
