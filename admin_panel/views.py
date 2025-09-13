from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.db.models import Sum
from django.http import JsonResponse
from django.middleware.csrf import get_token
from .models import Student, Employee, Expense, Transaction
import logging

logger = logging.getLogger(__name__)

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

    # Fetch all students, employees, expenses for rendering
    students = Student.objects.all()
    employees = Employee.objects.all()
    expenses = Expense.objects.all()

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
        'students': students,
        'employees': employees,
        'expenses': expenses,
    }
    return render(request, 'admin_panel/index.html', context)

@require_POST
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

def update_student(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    if request.method == 'POST':
        student.name = request.POST.get('student-name')
        student.type = request.POST.get('student-type')
        student.program = request.POST.get('student-program')
        student.level = request.POST.get('student-level')
        student.save()
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

def delete_student(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    if request.method == 'POST':
        student.delete()
        return redirect('admin_panel:dashboard')
    context = {'student': student}
    return render(request, 'admin_panel/delete_student.html', context)

def update_employee(request, employee_id):
    employee = get_object_or_404(Employee, id=employee_id)
    if request.method == 'POST':
        employee.name = request.POST.get('employee-name')
        employee.position = request.POST.get('employee-position')
        employee.department = request.POST.get('employee-department')
        employee.salary = request.POST.get('employee-salary')
        employee.save()
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

def delete_employee(request, employee_id):
    employee = get_object_or_404(Employee, id=employee_id)
    if request.method == 'POST':
        employee.delete()
        return redirect('admin_panel:dashboard')
    context = {'employee': employee}
    return render(request, 'admin_panel/delete_employee.html', context)

@require_POST
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

def update_expense(request, expense_id):
    expense = get_object_or_404(Expense, id=expense_id)
    if request.method == 'POST':
        expense.type = request.POST.get('expense-type')
        expense.description = request.POST.get('expense-description')
        expense.amount = request.POST.get('expense-amount')
        expense.save()
        return redirect('admin_panel:dashboard')
    context = {'expense': expense}
    return render(request, 'admin_panel/update_expense.html', context)

def delete_expense(request, expense_id):
    expense = get_object_or_404(Expense, id=expense_id)
    if request.method == 'POST':
        expense.delete()
        return redirect('admin_panel:dashboard')
    context = {'expense': expense}
    return render(request, 'admin_panel/delete_expense.html', context)

@require_POST
def add_transaction(request):
    date = request.POST.get('transaction-date')
    type_ = request.POST.get('transaction-type')
    description = request.POST.get('transaction-description')
    amount = request.POST.get('transaction-amount')
    if date and type_ and description and amount:
        Transaction.objects.create(
            date=date,
            type=type_,
            description=description,
            amount=amount,
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
        data = Student.objects.filter(type='trainee')
    elif tab_name == 'internees':
        data = Student.objects.filter(type__startswith='internee')
    elif tab_name == 'iot':
        data = Student.objects.filter(program='iot')
    elif tab_name == 'sod':
        data = Student.objects.filter(program='sod')
    elif tab_name == 'employees':
        data = Employee.objects.all()
    else:
        data = Student.objects.all()

    logger.debug(f"Tab: {tab_name}, Data: {list(data.values())}")
    return JsonResponse({'data': list(data.values())})
