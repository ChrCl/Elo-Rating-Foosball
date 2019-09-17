FROM python:3

ENV PYTHONUNBUFFERED 1

RUN mkdir /elo_rating_foosball
WORKDIR /elo_rating_foosball

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY manage.py .
COPY elo/ elo/
COPY elo_rating_foosball/ elo_rating_foosball/

EXPOSE 80

CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
