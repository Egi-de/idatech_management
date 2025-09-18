from django.contrib import admin
from .models import Student, Employee, Expense, Transaction

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'program', 'level')
    list_filter = ('type', 'program')
    search_fields = ('name',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'employee_id', 'position', 'department', 'employment_status', 'current_status', 'hire_date')
    list_filter = ('department', 'employment_status', 'current_status', 'hire_date')
    search_fields = ('first_name', 'last_name', 'employee_id', 'email', 'position', 'department')
    readonly_fields = ('full_name',)

    fieldsets = (
        ('Personal Information', {
            'fields': (
                ('first_name', 'middle_name', 'last_name'),
                'employee_id',
                'email',
                'phone',
                'date_of_birth',
                ('address_street', 'address_city'),
                ('address_state', 'address_zip'),
                'emergency_contact_name',
                'emergency_contact_phone',
                'profile_photo',
            )
        }),
        ('Employment Details', {
            'fields': (
                'hire_date',
                ('employment_status', 'employee_type'),
                'work_schedule',
                'manager',
                'contract_end_date',
                'probation_period_status',
            )
        }),
        ('Professional Information', {
            'fields': (
                ('position', 'department'),
                'skills',
                'certifications',
                'education_level',
                'years_of_experience',
                'previous_work_history',
                'performance_rating',
                'training_records',
                'access_permissions',
            )
        }),
        ('Financial Information', {
            'fields': (
                'salary',
                ('salary_range_min', 'salary_range_max'),
            )
        }),
        ('Status and Notes', {
            'fields': (
                'current_status',
                'notes',
            )
        }),
    )

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
