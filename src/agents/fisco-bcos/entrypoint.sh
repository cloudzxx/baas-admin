#!/usr/bin/bash

python manage.py migrate --noinput
python manage.py collectstatic --noinput

gunicorn fisco_bcos.wsgi:application --bind 0.0.0.0:5001 --workers 2
