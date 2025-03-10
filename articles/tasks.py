import feedparser
import re
import nltk
from collections import Counter
from datetime import datetime, timedelta
from django.utils.timezone import now
from background_task import background
from .models import *
from nltk.corpus import stopwords

# ✅ Télécharger les stopwords français pour éviter les mots inutiles
nltk.download('stopwords')
STOPWORDS = set(stopwords.words("french"))

def extract_tags_from_content(title, content):
    """
    Génère des tags dynamiques en analysant le texte de l'article.
    - Supprime les mots inutiles (stopwords).
    - Sélectionne les mots les plus fréquents.
    """
    text = f"{title.lower()} {content.lower()}"
    words = re.findall(r'\b\w{4,}\b', text)  # Prend les mots de 4 lettres ou plus
    words = [word for word in words if word not in STOPWORDS]  # Retire les mots courants

    most_common = Counter(words).most_common(5)  # Prend les 5 mots les plus fréquents
    return [word for word, freq in most_common]

@background(schedule=3600)  # 🔥 Exécution toutes les heures
def fetch_articles_for_feeds():
    """
    Tâche pour récupérer les articles des flux RSS toutes les heures et leur assigner des tags dynamiques.
    """
    feeds = RSSFeed.objects.all()
    for feed in feeds:
        parsed_feed = feedparser.parse(feed.url)
        if parsed_feed.bozo:  # Vérifie si le flux est valide
            print(f"❌ Erreur lors du parsing du flux : {feed.url}")
            continue

        for entry in parsed_feed.entries:
            if RSSFeedEntry.objects.filter(link=entry.link).exists():
                continue  # L'article existe déjà

            title = entry.title
            content = entry.get("summary", "")
            published_at = datetime(*entry.published_parsed[:6]) if "published_parsed" in entry else now()

            # ✅ Création de l'article
            article = RSSFeedEntry.objects.create(
                feed=feed,
                title=title,
                link=entry.link,
                content=content,
                published_at=published_at,
            )

            # ✅ Génération des tags dynamiques et assignation automatique
            detected_tags = extract_tags_from_content(title, content)
            article.tags.add(*detected_tags)  # 🔥 Ajout des tags générés automatiquement

            print(f"✅ Article ajouté : {title} avec tags {detected_tags}")

    fetch_articles_for_feeds(repeat=3600)


@background(schedule=86400)  # 🔥 Exécution quotidienne
def delete_old_articles():
    """
    Supprime les articles publiés il y a plus d'un jour, sauf ceux qui sont en favoris.
    """
    cutoff_time = now() - timedelta(days=1)

    # Récupère les IDs des articles favoris pour éviter leur suppression
    favorite_article_ids = Favorite.objects.values_list('article_id', flat=True)

    # Supprime les articles non favoris
    old_articles = RSSFeedEntry.objects.filter(published_at__lt=cutoff_time).exclude(id__in=favorite_article_ids)
    deleted_count, _ = old_articles.delete()

    print(f"🗑️ {deleted_count} articles supprimés (publiés avant {cutoff_time}, hors favoris).")

    delete_old_articles(schedule=86400)
