# Étape 1 : build du frontend React
FROM node:20 as frontend
WORKDIR /app
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# Étape 2 : image Django
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app/

# Supprime les anciens fichiers statiques React
RUN rm -rf veille/staticfiles/frontend

# Copie le build React *juste après* l’avoir généré
COPY --from=frontend /app/frontend/build/ veille/staticfiles/frontend/

RUN pip install --upgrade pip && pip install -r requirements.txt

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "veille.wsgi:application", "--bind", "0.0.0.0:8000"]
