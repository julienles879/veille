from django.core.management.base import BaseCommand
from django.utils.timezone import now
from datetime import timedelta

from articles.models import RSSFeedEntry, Favorite

class Command(BaseCommand):
    help = "Supprime les articles de plus de 24h non ajoutés en favoris"

    def handle(self, *args, **kwargs):
        cutoff = now() - timedelta(hours=24)
        favorite_ids = Favorite.objects.values_list('article_id', flat=True)

        articles_to_delete = RSSFeedEntry.objects.filter(
            published_at__lt=cutoff
        ).exclude(id__in=favorite_ids)

        count = articles_to_delete.count()

        for article in articles_to_delete:
            self.stdout.write(f"🗑 Suppression : {article.title} (id: {article.id})")
            article.delete()

        self.stdout.write(self.style.SUCCESS(f"✅ {count} articles supprimés."))
