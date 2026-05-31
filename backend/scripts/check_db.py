import os
import sys
from pathlib import Path

import psycopg
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / '.env')

for name in ('DIRECT_URL', 'DATABASE_URL'):
    url = (os.environ.get(name) or '').strip().strip('"').strip("'")
    if not url:
        continue
    if 'sslmode' not in url:
        url += '&sslmode=require' if '?' in url else '?sslmode=require'
    print(f'--- {name}')
    try:
        with psycopg.connect(url, connect_timeout=20) as conn:
            conn.execute('SELECT 1')
        print('OK')
    except Exception as exc:
        print(f'Failed: {exc}', file=sys.stderr)
