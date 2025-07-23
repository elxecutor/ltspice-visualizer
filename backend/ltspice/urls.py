from django.urls import path
from .views import parse_netlist

urlpatterns = [
    path('netlist/parse/', parse_netlist),
]
