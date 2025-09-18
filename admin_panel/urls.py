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
    path('search/', views.search, name='search'),
    path('delete-recent-activity/<int:activity_id>/', views.delete_recent_activity, name='delete_recent_activity'),
    path('ajax-delete-transaction/<int:transaction_id>/', views.ajax_delete_transaction, name='ajax_delete_transaction'),
    path('trash-bin/', views.trash_bin, name='trash_bin'),
    path('student-report/<int:student_id>/', views.student_report_detail, name='student_report_detail'),
    path('export-student-report-pdf/<int:student_id>/', views.export_student_report_pdf, name='export_student_report_pdf'),
    path('export-student-report-excel/<int:student_id>/', views.export_student_report_excel, name='export_student_report_excel'),
    path('email-student-report/<int:student_id>/', views.email_student_report, name='email_student_report'),
    path('bulk-delete-students/', views.bulk_delete_students, name='bulk_delete_students'),
    # Attendance
    path('add-attendance/', views.add_attendance, name='add_attendance'),
    path('edit-attendance/<int:pk>/', views.edit_attendance, name='edit_attendance'),
    path('delete-attendance/<int:pk>/', views.delete_attendance, name='delete_attendance'),
     # Performance
    path('add-performance/', views.add_performance, name='add_performance'),
    path('edit-performance/<int:pk>/', views.edit_performance, name='edit_performance'),
    path('delete-performance/<int:pk>/', views.delete_performance, name='delete_performance'),

    path('attendance/', views.attendance_list, name='attendance_list'),
    path('performance/', views.performance_list, name='performance_list'),
    path('activities/', views.activities_list, name='activities_list'),
    path('feedback/', views.feedback_list, name='feedback_list'),
    path('status/', views.status_list, name='status_list'),

    path('add-activities/', views.add_activities, name='add_activities'),
    path('edit-activities/<int:pk>/', views.edit_activities, name='edit_activities'),
    path('delete-activities/<int:pk>/', views.delete_activities, name='delete_activities'),

    path('add-feedback/', views.add_feedback, name='add_feedback'),
    path('edit-feedback/<int:pk>/', views.edit_feedback, name='edit_feedback'),
    path('delete-feedback/<int:pk>/', views.delete_feedback, name='delete_feedback'),

    path('add-status/', views.add_status, name='add_status'),
    path('edit-status/<int:pk>/', views.edit_status, name='edit_status'),
    path('delete-status/<int:pk>/', views.delete_status, name='delete_status'),
]

