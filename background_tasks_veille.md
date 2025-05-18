# 🛠️ Gestion des tâches en arrière-plan avec `django-background-tasks`

Ce document décrit comment configurer, exécuter et maintenir les tâches périodiques dans le projet `veille`, notamment pour :

- L'ajout automatique d'articles depuis les flux RSS (`fetch_articles_for_feeds`)
- La suppression des articles anciens (`delete_old_articles`)

---

## ✅ Objectifs des tâches

| Tâche                      | Description                                                              | Fréquence             |
| -------------------------- | ------------------------------------------------------------------------ | --------------------- |
| `fetch_articles_for_feeds` | Récupère les articles des flux RSS et les insère dans la base de données | Toutes les 10 minutes |
| `delete_old_articles`      | Supprime les articles de plus de 72h (sauf favoris)                      | Toutes les 72h        |

---

## 🔧 Mise en place (manuelle une fois)

### 1. Planifier les tâches

```bash
py manage.py shell
```

```python
from articles.tasks import fetch_articles_for_feeds, delete_old_articles

# Planifie l'import des articles toutes les 10 min
fetch_articles_for_feeds(repeat=600)

# Planifie la suppression des articles tous les 3 jours
delete_old_articles(repeat=259200)
```

> Ces tâches sont enregistrées dans la table `background_task_task`.

### 2. Supprimer les doublons éventuels

Toujours dans le shell :

```python
from background_task.models import Task

tasks_to_delete = list(Task.objects.filter(task_name='articles.tasks.fetch_articles_for_feeds'))[1:]
for task in tasks_to_delete:
    task.delete()
```

---

## 🚀 Exécution des tâches

Lancer dans un terminal dédié (en tâche de fond en prod) :

```bash
py manage.py process_tasks --sleep 60
```

> Cela lance un worker qui surveille les tâches toutes les 60 secondes.

---

## 🔍 Vérification

### Pour voir les tâches planifiées :

```python
from background_task.models import Task
Task.objects.all()
```

---

## ✉️ [À faire plus tard] : Système de logs par email

- Envoi automatique de mail à chaque :
  - Ajout de **flux**
  - Ajout de **nouvel article**
- Système basé sur `logging + SMTPHandler` ou `signals`

---

## 📁 Fichiers impliqués

- `articles/tasks.py` → Définition des tâches
- `feeds/views.py` → Appel de la tâche après ajout de flux
- `manage.py process_tasks` → Exécution des tâches

---

## 📌 Notes

- `@background(schedule=600)` signifie que la tâche sera lancée au moins 600s après enregistrement **et répétée toutes les 600s si `repeat=600`**
- L’exécution des tâches est **asynchrone**, donc les logs apparaissent dans le terminal de `process_tasks`, pas dans `runserver`.

---

## 🧪 Pour tester manuellement

```python
from articles.tasks import fetch_articles_for_feeds
fetch_articles_for_feeds()
```
