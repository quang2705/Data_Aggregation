from data_agg_api import views
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()
router.register(r'temperatures', views.TemperatureViewSet)

urlpatterns = [
    path(r'', include(router.urls)),
]
