from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, ExpenseViewSet

router = DefaultRouter()
router.register('trips', TripViewSet, basename='trip')      # ✅ ADD basename
router.register('expenses', ExpenseViewSet, basename='expense')  # ✅ ADD basename

urlpatterns = [
    path('api/auth/', include('accounts.urls')), 
    path('', include(router.urls)),
]