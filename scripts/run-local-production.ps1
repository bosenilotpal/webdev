# Run backend + frontend locally using .env.production (Supabase, DEBUG=False)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $Root '.env.production'

if (-not (Test-Path $EnvFile)) {
    Write-Error "Missing $EnvFile"
}

Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { return }
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { return }
    $name = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim().Trim('"').Trim("'")
    Set-Item -Path "Env:$name" -Value $value
}

Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
$env:ENV_FILE = '.env.production'

Write-Host 'Production-local env loaded from .env.production'
Write-Host "  DJANGO_DEBUG=$env:DJANGO_DEBUG"
Write-Host "  NEXT_PUBLIC_API_URL=$env:NEXT_PUBLIC_API_URL"
Write-Host ''
Write-Host 'Starting backend on http://127.0.0.1:8000 ...'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$Root\backend'; `$env:ENV_FILE='.env.production'; Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue; Get-Content '$EnvFile' | ForEach-Object { `$l = `$_.Trim(); if (`$l -eq '' -or `$l.StartsWith('#')) { return }; `$i = `$l.IndexOf('='); if (`$i -lt 1) { return }; Set-Item -Path ('Env:' + `$l.Substring(0,`$i).Trim()) -Value `$l.Substring(`$i+1).Trim().Trim('\"') }; py -3 manage.py collectstatic --noinput; py -3 manage.py runserver 127.0.0.1:8000 --insecure"
) -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host 'Starting frontend on http://127.0.0.1:3000 ...'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$Root\frontend'; `$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:8000/api'; `$env:API_URL='http://127.0.0.1:8000/api'; `$env:API_ORIGIN='http://127.0.0.1:8000'; npm run dev"
) -WindowStyle Normal

Write-Host ''
Write-Host 'App:  http://localhost:3000'
Write-Host 'API:  http://127.0.0.1:8000/api/'
Write-Host 'Admin: http://127.0.0.1:8000/admin/'
