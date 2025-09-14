from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password

# Create your views here.

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            messages.success(request, 'Login successful.')
            return redirect('admin_panel:dashboard')
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('auth:login')
    return render(request, 'admin_panel/login.html')

def logout(request):
    auth_logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('auth:login')

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            return redirect('auth:register')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return redirect('auth:register')

        user = User.objects.create_user(username=username, email=email, password=password1)
        user.save()
        messages.success(request, 'Registration successful. Please log in.')
        return redirect('auth:login')

    return render(request, 'admin_panel/register.html')

from .models import Profile

@login_required
def profile_settings(request):
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')
        profile_picture = request.FILES.get('profile_picture')

        if not username or not email:
            messages.error(request, 'Username and email cannot be empty.')
            return redirect('auth:settings')

        if User.objects.filter(username=username).exclude(pk=user.pk).exists():
            messages.error(request, 'Username already taken.')
            return redirect('auth:settings')

        user.username = username
        user.email = email

        # Handle password change
        if current_password or new_password or confirm_password:
            if not current_password:
                messages.error(request, 'Current password is required to change password.')
                return redirect('auth:settings')
            if not check_password(current_password, user.password):
                messages.error(request, 'Current password is incorrect.')
                return redirect('auth:settings')
            if not new_password:
                messages.error(request, 'New password cannot be empty.')
                return redirect('auth:settings')
            if new_password != confirm_password:
                messages.error(request, 'New passwords do not match.')
                return redirect('auth:settings')
            user.set_password(new_password)
            messages.success(request, 'Password changed successfully.')

        # Handle profile picture upload
        if profile_picture:
            profile.profile_picture = profile_picture
            profile.save()
            messages.success(request, 'Profile picture updated successfully.')

        user.save()
        messages.success(request, 'Profile updated successfully.')
        return redirect('auth:settings')

    return render(request, 'user_auth/settings.html', {'user': user, 'profile': profile})
