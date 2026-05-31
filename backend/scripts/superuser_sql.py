import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django

django.setup()

from django.contrib.auth.hashers import make_password

username = 'admin'
email = 'admin@fitconnect.com'
password = 'Admin123!'
h = make_password(password).replace("'", "''")

print('-- Username:', username)
print('-- Password:', password)
print()
print(f"DELETE FROM auth_user WHERE username = '{username}';")
print()
print(f"""INSERT INTO auth_user (
  password,
  last_login,
  is_superuser,
  username,
  first_name,
  last_name,
  email,
  is_staff,
  is_active,
  date_joined
) VALUES (
  '{h}',
  NULL,
  TRUE,
  '{username}',
  '',
  '',
  '{email}',
  TRUE,
  TRUE,
  NOW()
);""")
