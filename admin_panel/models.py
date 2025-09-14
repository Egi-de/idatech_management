from django.db import models
from django.contrib.auth.models import User

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

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    category = models.CharField(max_length=100, blank=True)  # Optional, can be used for further categorization
    program = models.CharField(max_length=10, choices=PROGRAM_CHOICES)
    level = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Employee(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

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
