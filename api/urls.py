from django.urls import path
from . import views

urlpatterns = [
    path('employees/', views.employee_list, name='employee_list'),
    path('employees/<int:pk>/', views.delete_employee, name='delete_employee'),
    path('attendance/', views.mark_attendance, name='mark_attendance'),
    path('employees/<int:emp_id>/attendance/', views.employee_attendance, name='employee_attendance'),
]