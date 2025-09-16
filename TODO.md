# Trash Bin Implementation TODO

## 1. Create TrashBinEntry Model
- Add TrashBinEntry model to admin_panel/models.py with fields: user, item_type, item_id, item_data (JSON), deleted_at

## 2. Create Database Migration
- Run makemigrations and migrate for the new model

## 3. Modify Delete Views
- Update delete_student, delete_employee, delete_expense, delete_transaction, delete_recent_activity views in admin_panel/views.py to save deleted item data to TrashBinEntry before deleting

## 4. Add Trash Bin View
- Create trash_bin view in admin_panel/views.py to display deleted items for the logged-in user

## 5. Add URL Route
- Add URL pattern for trash_bin in admin_panel/urls.py

## 6. Create Trash Bin Template
- Create template user_auth/trash_bin.html to display the trash bin entries with item details and timestamps

## 7. Update Settings Page
- Add link to trash bin in templates/user_auth/settings.html

## 8. Test Functionality
- Test deleting items and viewing them in trash bin
- Ensure proper display of item types, data, and timestamps
