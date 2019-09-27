#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'elo_rating_foosball.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    if len(sys.argv)>1:
        execute_from_command_line(sys.argv)
    else:
        try:
            execute_from_command_line(['manage.py','makemigrations'])
        except:
            print("Oops!",sys.exc_info()[0],"occured.")
        execute_from_command_line(['manage.py','migrate','--run-syncdb'])
        execute_from_command_line(['manage.py','runserver','0.0.0.0:8000'])

if __name__ == '__main__':
    main()
