# Étape 1 : Build frontend
FROM node:20 as frontend
WORKDIR /app
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# Étape 2 : Backend Django
FROM python:3.11-slim
WORKDIR /app
COPY . /app/
COPY --from=frontend /app/frontend/build/ veille/staticfiles/frontend/
RUN pip install --upgrade pip && pip install -r requirements.txt
RUN rm -rf veille/staticfiles/*
RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "veille.wsgi:application", "--bind", "0.0.0.0:8000"]
