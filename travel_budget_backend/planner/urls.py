from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, ExpenseViewSet

router = DefaultRouter()
router.register('trips', TripViewSet)
router.register('expenses', ExpenseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]