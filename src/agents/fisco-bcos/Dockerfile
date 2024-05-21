FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p baas-admin

EXPOSE 5001
CMD ["gunicorn", "fisco_bcos.wsgi:application", "--bind", "0.0.0.0:5001", "--workers", "2"]
