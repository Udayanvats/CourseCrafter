FROM python:3.9-slim



WORKDIR /

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apt-get update \
  && apt-get -y install tesseract-ocr





RUN tesseract --version



CMD ["python3", "app.py"]
