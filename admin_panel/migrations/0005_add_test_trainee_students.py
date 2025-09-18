from django.db import migrations

def add_test_trainee_students(apps, schema_editor):
    Student = apps.get_model('admin_panel', 'Student')
    Student.objects.create(
        name='Test Trainee 1',
        student_id='TT001',
        type='trainee',
        program='iot',
        level='Beginner',
        address='Test Address 1',
    )
    Student.objects.create(
        name='Test Trainee 2',
        student_id='TT002',
        type='trainee',
        program='sod',
        level='Intermediate',
        address='Test Address 2',
    )

class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel', '0004_student_absences_student_address_and_more'),
    ]

    operations = [
        migrations.RunPython(add_test_trainee_students),
    ]
