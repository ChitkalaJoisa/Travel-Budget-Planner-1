# from django.db import models

# # Create your models here.
# from django.contrib.auth.models import User
# from django.db import models

# class Trip(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     budget = models.FloatField()
#     start_date = models.DateField()
#     end_date = models.DateField()

#     def __str__(self):
#         return self.name


# class Expense(models.Model):
#     CATEGORY_CHOICES = [
#         ('Food', 'Food'),
#         ('Transport', 'Transport'),
#         ('Hotel', 'Hotel'),
#         ('Other', 'Other'),
#     ]

#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
#     category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
#     amount = models.FloatField()
#     date = models.DateField()

#     def __str__(self):
#         return f"{self.category} - {self.amount}"

from django.contrib.auth.models import User
from django.db import models

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    budget = models.FloatField()

    def __str__(self):
        return self.name


class Expense(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    category = models.CharField(max_length=50)
    amount = models.FloatField()

    def __str__(self):
        return self.category