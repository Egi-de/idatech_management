from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import JSONField
import json

class Student(models.Model):
    TRAINEE = 'trainee'
    INTERNEE_UNIVERSITY = 'internee-university'
    INTERNEE_HIGHSCHOOL = 'internee-highschool'
    TYPE_CHOICES = [
        (TRAINEE, 'Trainee'),
        (INTERNEE_UNIVERSITY, 'Internee (University)'),
        (INTERNEE_HIGHSCHOOL, 'Internee (High School)'),
    ]

    IOT = 'iot'
    SOD = 'sod'
    PROGRAM_CHOICES = [
        (IOT, 'IoT'),
        (SOD, 'SoD'),
    ]

    ACTIVE = 'active'
    GRADUATED = 'graduated'
    DROPPED = 'dropped'
    ON_HOLD = 'on_hold'
    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (GRADUATED, 'Graduated'),
        (DROPPED, 'Dropped'),
        (ON_HOLD, 'On Hold'),
    ]

    name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=20, unique=True, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    enrollment_date = models.DateField(default=timezone.now)
    photo = models.ImageField(upload_to='student_photos/', blank=True, null=True)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    category = models.CharField(max_length=100, blank=True)  # Optional, can be used for further categorization
    program = models.CharField(max_length=10, choices=PROGRAM_CHOICES)
    level = models.CharField(max_length=50)

    # Attendance & Participation
    total_sessions = models.PositiveIntegerField(default=0)
    attended_sessions = models.PositiveIntegerField(default=0)
    absences = models.PositiveIntegerField(default=0)
    participation_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    # Performance / Grades
    avg_scores = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    project_completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    certifications = models.TextField(blank=True)
    progress_graph_data = JSONField(blank=True, null=True)  # List of {'date': 'YYYY-MM-DD', 'score': 85.5}

    # Activities & Achievements
    hackathons_attended = models.TextField(blank=True)
    awards = models.TextField(blank=True)
    contributions = models.TextField(blank=True)

    # Feedback & Evaluation
    mentor_comments = models.TextField(blank=True)
    peer_reviews = models.TextField(blank=True)
    strengths = models.TextField(blank=True)
    areas_for_improvement = models.TextField(blank=True)

    # Status & Recommendations
    current_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=ACTIVE)
    next_steps = models.TextField(blank=True)
    graduation_eligibility = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    @property
    def attendance_percentage(self):
        if self.total_sessions > 0:
            return (self.attended_sessions / self.total_sessions) * 100
        return 0

class Employee(models.Model):
    # Personal Information
    employee_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address_street = models.CharField(max_length=255, blank=True, null=True)
    address_city = models.CharField(max_length=100, blank=True, null=True)
    address_state = models.CharField(max_length=100, blank=True, null=True)
    address_zip = models.CharField(max_length=10, blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='employee_photos/', blank=True, null=True)

    # Employment Details
    hire_date = models.DateField(default=timezone.now)
    employment_status = models.CharField(max_length=20, choices=[
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('intern', 'Intern'),
    ], default='full_time')
    employee_type = models.CharField(max_length=20, choices=[
        ('permanent', 'Permanent'),
        ('temporary', 'Temporary'),
        ('seasonal', 'Seasonal'),
    ], default='permanent')
    work_schedule = models.CharField(max_length=100, blank=True, null=True)
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='subordinates')
    contract_end_date = models.DateField(blank=True, null=True)
    probation_period_status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('extended', 'Extended'),
    ], blank=True, null=True)

    # Professional Information
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    skills = models.TextField(blank=True, null=True)
    certifications = models.TextField(blank=True, null=True)
    education_level = models.CharField(max_length=100, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    previous_work_history = models.TextField(blank=True, null=True)
    performance_rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    training_records = models.TextField(blank=True, null=True)
    access_permissions = models.CharField(max_length=100, blank=True, null=True)

    # Financial Information
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    salary_range_min = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    salary_range_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # Status and Additional Info
    current_status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('on_leave', 'On Leave'),
        ('terminated', 'Terminated'),
        ('inactive', 'Inactive'),
    ], default='active')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

    @property
    def name(self):
        return self.full_name

    @property
    def salary_range(self):
        if self.salary_range_min and self.salary_range_max:
            return f"${self.salary_range_min} - ${self.salary_range_max}"
        return f"${self.salary}"

    @property
    def department_color(self):
        department_colors = {
            'IT': 'blue',
            'HR': 'green',
            'Finance': 'yellow',
            'Marketing': 'purple',
            'Operations': 'red',
            'Sales': 'indigo',
        }
        return department_colors.get(self.department, 'gray')

    @property
    def status_color(self):
        status_colors = {
            'active': 'green',
            'on_leave': 'yellow',
            'terminated': 'red',
            'inactive': 'gray',
        }
        return status_colors.get(self.current_status, 'gray')

class Expense(models.Model):
    SALARY = 'salary'
    TRANSPORT = 'transport'
    OTHER = 'other'
    TYPE_CHOICES = [
        (SALARY, 'Salary'),
        (TRANSPORT, 'Transport'),
        (OTHER, 'Other'),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.amount}"

class Transaction(models.Model):
    SALARY = 'salary'
    TRANSPORT = 'transport'
    OTHER = 'other'
    TYPE_CHOICES = [
        (SALARY, 'Salary'),
        (TRANSPORT, 'Transport'),
        (OTHER, 'Other'),
    ]

    date = models.DateField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.type} - {self.amount}"

class RecentActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    icon_class = models.CharField(max_length=100, default='fas fa-info-circle')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"

class TrashBinEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_type = models.CharField(max_length=100)
    item_id = models.PositiveIntegerField()
    item_data = JSONField()
    deleted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-deleted_at']

    def __str__(self):
        return f"Deleted {self.item_type} (ID: {self.item_id}) by {self.user.username} at {self.deleted_at}"

    def formatted_item_data(self):
        """
        Return a user-friendly string representation of item_data.
        Tries to extract key fields like 'action' or others for display.
        """
        if not self.item_data:
            return "No details available"

        # If item_data is a dict, try to extract meaningful info
        if isinstance(self.item_data, dict):
            # Example: show 'action' if present
            action = self.item_data.get('action')
            if action:
                return action
            # Otherwise, join key-value pairs
            details_list = []
            for key, value in self.item_data.items():
                details_list.append(f"{key}: {value}")
            return ", ".join(details_list)

        # If item_data is a string or other type, return as is
        return str(self.item_data)
        
