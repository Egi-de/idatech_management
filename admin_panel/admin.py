from django.contrib import admin
from .models import Student, Employee, Expense, Transaction, RecentActivity, TrashBinEntry, StudentProfile, EnrollmentDetail, AttendanceParticipation, PerformanceGrades, ActivitiesAchievements, FeedbackEvaluation, StatusRecommendations

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

@admin.register(RecentActivity)
class RecentActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('action',)

@admin.register(TrashBinEntry)
class TrashBinEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'item_type', 'item_id', 'deleted_at')
    list_filter = ('deleted_at',)
    search_fields = ('item_type',)

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('student', 'name', 'email')
    search_fields = ('name', 'email')

@admin.register(EnrollmentDetail)
class EnrollmentDetailAdmin(admin.ModelAdmin):
    list_display = ('student', 'type', 'program', 'level')
    list_filter = ('type', 'program')
    search_fields = ('student__name',)

@admin.register(AttendanceParticipation)
class AttendanceParticipationAdmin(admin.ModelAdmin):
    list_display = ('student', 'total_sessions', 'attended_sessions', 'attendance_percentage')
    search_fields = ('student__name',)

@admin.register(PerformanceGrades)
class PerformanceGradesAdmin(admin.ModelAdmin):
    list_display = ('student', 'avg_scores', 'project_completion_rate')
    search_fields = ('student__name',)

@admin.register(ActivitiesAchievements)
class ActivitiesAchievementsAdmin(admin.ModelAdmin):
    list_display = ('student', 'hackathons_attended', 'awards')
    search_fields = ('student__name',)

@admin.register(FeedbackEvaluation)
class FeedbackEvaluationAdmin(admin.ModelAdmin):
    list_display = ('student', 'mentor_comments', 'strengths')
    search_fields = ('student__name',)

@admin.register(StatusRecommendations)
class StatusRecommendationsAdmin(admin.ModelAdmin):
    list_display = ('student', 'current_status', 'graduation_eligibility')
    list_filter = ('current_status', 'graduation_eligibility')
    search_fields = ('student__name',)
