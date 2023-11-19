FROM python:3.9-slim-buster

RUN apt-get update && apt install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="${PYTHONPATH}:/opt/app"

WORKDIR /opt/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN rm requirements.txt

COPY webapp .
COPY manage.py .

CMD python manage.py runserver 0.0.0.0:8000
