# Étape 1 : build du frontend React
FROM node:20 as frontend
WORKDIR /app
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# Étape 2 : image Django minimaliste
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Paquets système de base
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

# Crée le répertoire de travail
WORKDIR /app

# Copie le projet backend
COPY . /app/

# Copie le frontend compilé dans les fichiers statiques de Django
COPY --from=frontend /app/frontend/build/ veille/staticfiles/frontend/

# Install des dépendances Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Collecte des fichiers statiques
RUN python manage.py collectstatic --noinput

# Commande de lancement de l'app Django
CMD ["gunicorn", "veille.wsgi:application", "--bind", "0.0.0.0:8000"]
