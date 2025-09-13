from django.contrib import admin
from .models import Student, Employee, Expense, Transaction

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'program', 'level')
    list_filter = ('type', 'program')
    search_fields = ('name',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'department', 'salary')
    search_fields = ('name', 'position', 'department')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('type', 'description', 'amount', 'date')
    list_filter = ('type', 'date')
    search_fields = ('description',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('date', 'type', 'description', 'amount')
    list_filter = ('date', 'type')
    search_fields = ('description',)
