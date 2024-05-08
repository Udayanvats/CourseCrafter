FROM python:3.9-slim

# ENV PYHTONUNBUFFERED=1


WORKDIR /

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apt-get update \
  && apt-get -y install tesseract-ocr

#  5000:5672



CMD ["python3", "app.py"]
