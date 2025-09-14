from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.db.models import Sum
from django.http import JsonResponse
from django.middleware.csrf import get_token
from .models import Student, Employee, Expense, Transaction, RecentActivity
from django.contrib.auth.decorators import login_required
from user_auth.models import Profile

@login_required
def dashboard(request):
    # Fetch counts and summaries for dashboard
    total_students = Student.objects.count()
    total_employees = Employee.objects.count()
    iot_students = Student.objects.filter(program='iot').count()
    sod_students = Student.objects.filter(program='sod').count()

    # Financial summaries
    total_salaries = Employee.objects.aggregate(Sum('salary'))['salary__sum'] or 0
    transport_expenses = Expense.objects.filter(type=Expense.TRANSPORT).aggregate(Sum('amount'))['amount__sum'] or 0
    other_expenses = Expense.objects.filter(type=Expense.OTHER).aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = total_salaries + transport_expenses + other_expenses

    # Recent transactions (last 5)
    recent_transactions = Transaction.objects.order_by('-date')[:5]

    # Recent activities (last 5)
    recent_activities = RecentActivity.objects.order_by('-timestamp')[:5]

    # Fetch all students, employees, expenses for rendering
    students = Student.objects.all()
    employees = Employee.objects.all()
    expenses = Expense.objects.all()

    # Get or create profile for logged-in user
    profile, created = Profile.objects.get_or_create(user=request.user)

    context = {
        'total_students': total_students,
        'total_employees': total_employees,
        'iot_students': iot_students,
        'sod_students': sod_students,
        'total_salaries': total_salaries,
        'transport_expenses': transport_expenses,
        'other_expenses': other_expenses,
        'total_expenses': total_expenses,
        'recent_transactions': recent_transactions,
        'recent_activities': recent_activities,
        'students': students,
        'employees': employees,
        'expenses': expenses,
        'profile': profile,
    }
    return render(request, 'admin_panel/index.html', context)

@require_POST
@login_required
def add_student(request):
    name = request.POST.get('student-name')
    type_ = request.POST.get('student-type')
    program = request.POST.get('student-program')
    level = request.POST.get('student-level')
    if name and type_ and program and level:
        student = Student.objects.create(
            name=name,
            type=type_,
            program=program,
            level=level,
        )
        # Create recent activity
        RecentActivity.objects.create(
            user=request.user,
            action=f"New trainee {student.name} added to {student.get_program_display()} program",
            icon_class="fas fa-plus-circle text-green-500"
        )
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            # AJAX request
            total_students = Student.objects.count()
            iot_students = Student.objects.filter(program='iot').count()
            sod_students = Student.objects.filter(program='sod').count()
            return JsonResponse({
                'success': True,
                'student': {
                    'id': student.id,
                    'name': student.name,
                    'type': student.get_type_display(),
                    'category': student.category,
                    'program': student.get_program_display(),
                    'level': student.level,
                },
                'counts': {
                    'total_students': total_students,
                    'iot_students': iot_students,
                    'sod_students': sod_students,
                }
            })
    return redirect('admin_panel:dashboard')





@require_POST
@login_required
def add_employee(request):
    name = request.POST.get('employee-name')
    position = request.POST.get('employee-position')
    department = request.POST.get('employee-department')
    salary = request.POST.get('employee-salary')
    if name and position and department and salary:
        employee = Employee.objects.create(
            name=name,
            position=position,
            department=department,
            salary=salary,
        )
        # Create recent activity
        RecentActivity.objects.create(
            user=request.user,
            action=f"New employee {employee.name} added to {employee.department} department",
            icon_class="fas fa-user-plus text-green-500"
        )
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            # AJAX request
            total_employees = Employee.objects.count()
            total_salaries = Employee.objects.aggregate(Sum('salary'))['salary__sum'] or 0
            transport_expenses = Expense.objects.filter(type=Expense.TRANSPORT).aggregate(Sum('amount'))['amount__sum'] or 0
            other_expenses = Expense.objects.filter(type=Expense.OTHER).aggregate(Sum('amount'))['amount__sum'] or 0
            total_expenses = total_salaries + transport_expenses + other_expenses
            return JsonResponse({
                'success': True,
                'employee': {
                    'id': employee.id,
                    'name': employee.name,
                    'position': employee.position,
                    'department': employee.department,
                    'salary': str(employee.salary),
                },
                'financial': {
                    'total_salaries': total_salaries,
                    'total_expenses': total_expenses,
                },
                'counts': {
                    'total_employees': total_employees,
                }
            })
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'success': False, 'error': 'Missing required fields'})
    return redirect('admin_panel:dashboard')

@login_required
def update_student(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    if request.method == 'POST':
        student.name = request.POST.get('student-name')
        student.type = request.POST.get('student-type')
        student.program = request.POST.get('student-program')
        student.level = request.POST.get('student-level')
        student.save()
        # Create recent activity
        RecentActivity.objects.create(
            user=request.user,
            action=f"Updated trainee {student.name} in {student.get_program_display()} program",
            icon_class="fas fa-edit text-blue-500"
        )
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'student': {
                    'id': student.id,
                    'name': student.name,
                    'type': student.get_type_display(),
                    'category': student.category,
                    'program': student.get_program_display(),
                    'level': student.level,
                }
            })
        return redirect('admin_panel:dashboard')
    return redirect('admin_panel:dashboard')

@login_required
def delete_student(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    if request.method == 'POST':
        # Create recent activity before deleting
        RecentActivity.objects.create(
            user=request.user,
            action=f"Deleted trainee {student.name} from {student.get_program_display()} program",
            icon_class="fas fa-trash text-red-500"
        )
        student.delete()
        return redirect('admin_panel:dashboard')
    context = {'student': student}
    return render(request, 'admin_panel/delete_student.html', context)

@login_required
def update_employee(request, employee_id):
    employee = get_object_or_404(Employee, id=employee_id)
    if request.method == 'POST':
        employee.name = request.POST.get('employee-name')
        employee.position = request.POST.get('employee-position')
        employee.department = request.POST.get('employee-department')
        employee.salary = request.POST.get('employee-salary')
        employee.save()
        # Create recent activity
        RecentActivity.objects.create(
            user=request.user,
            action=f"Updated employee {employee.name} in {employee.department} department",
            icon_class="fas fa-edit text-blue-500"
        )
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'employee': {
                    'id': employee.id,
                    'name': employee.name,
                    'position': employee.position,
                    'department': employee.department,
                    'salary': str(employee.salary),
                }
            })
        return redirect('admin_panel:dashboard')
    return redirect('admin_panel:dashboard')

@login_required
def delete_employee(request, employee_id):
    employee = get_object_or_404(Employee, id=employee_id)
    if request.method == 'POST':
        # Create recent activity before deleting
        RecentActivity.objects.create(
            user=request.user,
            action=f"Deleted employee {employee.name} from {employee.department} department",
            icon_class="fas fa-trash text-red-500"
        )
        employee.delete()
        return redirect('admin_panel:dashboard')
    context = {'employee': employee}
    return render(request, 'admin_panel/delete_employee.html', context)

@require_POST
@login_required
def add_expense(request):
    type_ = request.POST.get('expense-type')
    description = request.POST.get('expense-description')
    amount = request.POST.get('expense-amount')
    if type_ and description and amount:
        expense = Expense.objects.create(
            type=type_,
            description=description,
            amount=amount,
        )
        # Also create a transaction for the expense
        Transaction.objects.create(
            type=type_,
            description=description,
            amount=amount,
        )
        # Create recent activity
        RecentActivity.objects.create(
            user=request.user,
            action=f"New expense added: {description} - ${amount}",
            icon_class="fas fa-dollar-sign text-green-500"
        )
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            # AJAX request
            total_salaries = Employee.objects.aggregate(Sum('salary'))['salary__sum'] or 0
            transport_expenses = Expense.objects.filter(type=Expense.TRANSPORT).aggregate(Sum('amount'))['amount__sum'] or 0
            other_expenses = Expense.objects.filter(type=Expense.OTHER).aggregate(Sum('amount'))['amount__sum'] or 0
            total_expenses = total_salaries + transport_expenses + other_expenses
            return JsonResponse({
                'success': True,
                'total_salaries': total_salaries,
                'transport_expenses': transport_expenses,
                'other_expenses': other_expenses,
                'total_expenses': total_expenses,
            })
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'success': False, 'error': 'Missing required fields'})
    return redirect('admin_panel:dashboard')

def recent_transactions(request):
    transactions = Transaction.objects.order_by('-date')[:5]
    data = []
    for tx in transactions:
        data.append({
            'date': tx.date.strftime('%Y-%m-%d'),
            'type': tx.get_type_display(),
            'description': tx.description,
            'amount': str(tx.amount),
        })
    return JsonResponse({'transactions': data})

@login_required
def update_expense(request, expense_id):
    expense = get_object_or_404(Expense, id=expense_id)
    if request.method == 'POST':
        expense.type = request.POST.get('expense-type')
        expense.description = request.POST.get('expense-description')
        expense.amount = request.POST.get('expense-amount')
        expense.save()
        # Create recent activity
        RecentActivity.objects.create(
            user=request.user,
            action=f"Updated expense: {expense.description} - ${expense.amount}",
            icon_class="fas fa-edit text-blue-500"
        )
        return redirect('admin_panel:dashboard')
    context = {'expense': expense}
    return render(request, 'admin_panel/update_expense.html', context)

@login_required
def delete_expense(request, expense_id):
    expense = get_object_or_404(Expense, id=expense_id)
    if request.method == 'POST':
        # Create recent activity before deleting
        RecentActivity.objects.create(
            user=request.user,
            action=f"Deleted expense: {expense.description} - ${expense.amount}",
            icon_class="fas fa-trash text-red-500"
        )
        expense.delete()
        return redirect('admin_panel:dashboard')
    context = {'expense': expense}
    return render(request, 'admin_panel/delete_expense.html', context)

@require_POST
@login_required
def add_transaction(request):
    date = request.POST.get('transaction-date')
    type_ = request.POST.get('transaction-type')
    description = request.POST.get('transaction-description')
    amount = request.POST.get('transaction-amount')
    if date and type_ and description and amount:
        transaction = Transaction.objects.create(
            date=date,
            type=type_,
            description=description,
            amount=amount,
        )
        # Create recent activity
        RecentActivity.objects.create(
            user=request.user,
            action=f"New transaction added: {description} - ${amount}",
            icon_class="fas fa-exchange-alt text-blue-500"
        )
    return redirect('admin_panel:dashboard')

def update_transaction(request, transaction_id):
    transaction = get_object_or_404(Transaction, id=transaction_id)
    if request.method == 'POST':
        transaction.date = request.POST.get('transaction-date')
        transaction.type = request.POST.get('transaction-type')
        transaction.description = request.POST.get('transaction-description')
        transaction.amount = request.POST.get('transaction-amount')
        transaction.save()
        return redirect('admin_panel:dashboard')
    context = {'transaction': transaction}
    return render(request, 'admin_panel/update_transaction.html', context)

def delete_transaction(request, transaction_id):
    transaction = get_object_or_404(Transaction, id=transaction_id)
    if request.method == 'POST':
        transaction.delete()
        return redirect('admin_panel:dashboard')
    context = {'transaction': transaction}
    return render(request, 'admin_panel/delete_transaction.html', context)

def fetch_tab_data(request, tab_name):
    if tab_name == 'trainees':
        data = Student.objects.filter(type='trainee').values()
    elif tab_name == 'internees':
        data = Student.objects.filter(type='internee').values()
    elif tab_name == 'iot':
        data = Student.objects.filter(type='iot').values()
    elif tab_name == 'sod':
        data = Student.objects.filter(type='sod').values()
    else:
        data = []

    return JsonResponse({'data': list(data)})

from django.db.models import Q
from django.contrib.auth.decorators import login_required

@login_required
def search(request):
    query = request.GET.get('q', '').strip()
    students = []
    employees = []
    expenses = []

    if query:
        students = Student.objects.filter(
            Q(name__icontains=query) |
            Q(type__icontains=query) |
            Q(category__icontains=query) |
            Q(program__icontains=query) |
            Q(level__icontains=query)
        )
        employees = Employee.objects.filter(
            Q(name__icontains=query) |
            Q(position__icontains=query) |
            Q(department__icontains=query)
        )
        expenses = Expense.objects.filter(
            Q(description__icontains=query) |
            Q(type__icontains=query)
        )

    context = {
        'query': query,
        'students': students,
        'employees': employees,
        'expenses': expenses,
    }
    return render(request, 'admin_panel/search_results.html', context)
