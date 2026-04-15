from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Trip, Expense
from .serializers import TripSerializer, ExpenseSerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = Expense.objects.all()
        trip_id = self.request.query_params.get('trip')

        if trip_id:
            queryset = queryset.filter(trip_id=trip_id)

        return queryset