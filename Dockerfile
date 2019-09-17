FROM python:3

ENV PYTHONUNBUFFERED 1

RUN mkdir /elo
WORKDIR /elo

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY manage.py .
COPY elo/ .
COPY elo_rating_foosball/ .

EXPOSE 80

CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
