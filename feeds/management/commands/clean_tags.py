from django.core.management.base import BaseCommand
from taggit.models import Tag

class Command(BaseCommand):
    help = 'Supprime les tags indésirables issus du HTML ou non pertinents'

    def handle(self, *args, **kwargs):
        tags_to_remove = {
            'class', 'autobr', 'href', 'https', 'br', 'img', 'span', 'src', 'rel', 'nofollow',
            'directory', 'tag', 'title', 'content', 'html', 'meta', 'link', 'stylesheet',
            'button', 'text', 'css', 'container', 'type', 'value', 'name', 'id', 'div'
        }

        deleted_count = 0
        for tag in Tag.objects.all():
            if tag.name.lower() in tags_to_remove:
                self.stdout.write(self.style.WARNING(f"🗑 Suppression du tag : {tag.name}"))
                tag.delete()
                deleted_count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {deleted_count} tags supprimés."))
