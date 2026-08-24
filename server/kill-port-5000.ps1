$pid = (Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue).OwningProcess

if ($pid) {
    Stop-Process -Id $pid -Force
    Write-Host "✅ Port 5000 freed (PID: $pid)"
} else {
    Write-Host "ℹ️ Port 5000 is already free"
}