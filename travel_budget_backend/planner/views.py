from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Trip, Expense
from .serializers import TripSerializer, ExpenseSerializer

from rest_framework.permissions import IsAuthenticated

class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Expense.objects.filter(trip__user=self.request.user)

        trip_id = self.request.query_params.get('trip')
        if trip_id:
            queryset = queryset.filter(trip_id=trip_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save()