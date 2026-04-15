from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Trip, Expense

admin.site.register(Trip)
admin.site.register(Expense)