# Generated by Django 5.1.4 on 2024-12-06 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RSSFeed',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Titre du flux RSS.', max_length=255)),
                ('url', models.URLField(help_text='URL du flux RSS.', unique=True)),
                ('description', models.TextField(blank=True, help_text='Description du flux RSS.', null=True)),
                ('category', models.CharField(blank=True, help_text='Catégorie associée au flux RSS.', max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text="Date d'ajout du flux RSS.")),
            ],
        ),
    ]
