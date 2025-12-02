# 启动服务的便捷脚本
# 使用方法: .\start-service.ps1

# 添加 Go 到 PATH
$env:Path += ";D:\go\bin"

# 加载环境变量
Write-Host "加载环境变量..." -ForegroundColor Cyan
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
    }
}

Write-Host "`n启动 Movie Rating API 服务..." -ForegroundColor Green
Write-Host "服务地址: http://localhost:$env:PORT" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 停止服务`n" -ForegroundColor Yellow

# 启动服务
go run cmd/server/main.go
