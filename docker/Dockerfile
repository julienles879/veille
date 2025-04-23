# Dockerfile

### Étape 1 : Build du frontend React
FROM node:20 AS frontend
WORKDIR /app
COPY frontend/ ./frontend/
RUN cd frontend \
    && npm install \
    && npm run build

### Étape 2 : Backend Django avec frontend intégré
FROM python:3.11-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dépendances système
RUN apt-get update \
    && apt-get install -y gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Copie du projet et des fichiers de conf
COPY . /app/

# Copie du build React
COPY --from=frontend /app/frontend/build/ veille/staticfiles/frontend/

# Install des dépendances Python
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Collecte des fichiers statiques Django
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "veille.wsgi:application", "--bind", "0.0.0.0:8000"]
