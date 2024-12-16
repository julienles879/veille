from django.db import models

class TaskConfiguration(models.Model):
    """
    Modèle pour configurer les paramètres des tâches en arrière-plan.
    """
    task_name = models.CharField(max_length=255, unique=True, help_text="Nom de la tâche.")
    repeat_time = models.IntegerField(default=120, help_text="Temps de répétition en secondes.")

    def __str__(self):
        return f"{self.task_name} - Repeat every {self.repeat_time} seconds"
