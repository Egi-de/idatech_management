from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('add-student/', views.add_student, name='add_student'),
    path('add-employee/', views.add_employee, name='add_employee'),
    path('add-expense/', views.add_expense, name='add_expense'),
    path('recent-transactions/', views.recent_transactions, name='recent_transactions'),
    path('add-transaction/', views.add_transaction, name='add_transaction'),
    path('update-student/<int:student_id>/', views.update_student, name='update_student'),
    path('delete-student/<int:student_id>/', views.delete_student, name='delete_student'),
    path('update-employee/<int:employee_id>/', views.update_employee, name='update_employee'),
    path('delete-employee/<int:employee_id>/', views.delete_employee, name='delete_employee'),
    path('update-expense/<int:expense_id>/', views.update_expense, name='update_expense'),
    path('delete-expense/<int:expense_id>/', views.delete_expense, name='delete_expense'),
    path('update-transaction/<int:transaction_id>/', views.update_transaction, name='update_transaction'),
    path('delete-transaction/<int:transaction_id>/', views.delete_transaction, name='delete_transaction'),
]
