from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('add-student/', views.add_student, name='add_student'),
    path('add-employee/', views.add_employee, name='add_employee'),
    path('add-employee-form/', views.add_employee_form, name='add_employee_form'),
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
    path('search/', views.search, name='search'),
    path('delete-recent-activity/<int:activity_id>/', views.delete_recent_activity, name='delete_recent_activity'),
    path('ajax-delete-transaction/<int:transaction_id>/', views.ajax_delete_transaction, name='ajax_delete_transaction'),
    path('trash-bin/', views.trash_bin, name='trash_bin'),
    path('student-report/<int:student_id>/', views.student_report_detail, name='student_report_detail'),
    path('export-student-report-pdf/<int:student_id>/', views.export_student_report_pdf, name='export_student_report_pdf'),
    path('export-student-report-excel/<int:student_id>/', views.export_student_report_excel, name='export_student_report_excel'),
    path('email-student-report/<int:student_id>/', views.email_student_report, name='email_student_report'),

    path('employment-report/<int:employee_id>/', views.employment_report_detail, name='employment_report_detail'),
    path('export-employment-report-pdf/<int:employee_id>/', views.export_employment_report_pdf, name='export_employment_report_pdf'),
    path('export-employment-report-excel/<int:employee_id>/', views.export_employment_report_excel, name='export_employment_report_excel'),
    path('email-employment-report/<int:employee_id>/', views.email_employment_report, name='email_employment_report'),

    path('financial-report/', views.financial_report_detail, name='financial_report_detail'),
    path('export-financial-report-pdf/', views.export_financial_report_pdf, name='export_financial_report_pdf'),
    path('export-financial-report-excel/', views.export_financial_report_excel, name='export_financial_report_excel'),
    path('email-financial-report/', views.email_financial_report, name='email_financial_report'),

    path('bulk-delete-students/', views.bulk_delete_students, name='bulk_delete_students'),
    path('fetch-tab-data/<str:tab_name>/', views.fetch_tab_data, name='fetch_tab_data'),
    path('bulk-delete-employees/', views.bulk_delete_employees, name='bulk_delete_employees'),
]
