import subprocess
import sys
import os

# Change to the correct directory
os.chdir('idatech_management')

# Run makemigrations with automated input
process = subprocess.Popen(
    [sys.executable, 'manage.py', 'makemigrations', 'admin_panel'],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Send inputs
inputs = ['1', 'LastName']
output, error = process.communicate('\n'.join(inputs))

print("Output:", output)
print("Error:", error)
