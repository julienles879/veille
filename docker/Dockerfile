# Étape 1 : build du frontend React
FROM node:20 as frontend
WORKDIR /app/frontend
COPY frontend/ ./
RUN npm install && npm run build

# Étape 2 : build de l’app Django
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Libs systèmes utiles
RUN apt-get update && apt-get install -y \
    netcat gcc postgresql-client libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

# Installation des dépendances Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Déplacement du frontend compilé dans static
RUN mkdir -p veille/staticfiles/frontend && cp -r /app/frontend/build/* veille/staticfiles/frontend/

# Collectstatic (optionnel ici si déjà fait)
RUN python manage.py collectstatic --noinput

# Commande par défaut
CMD ["gunicorn", "veille.wsgi:application", "--bind", "0.0.0.0:8000"]
