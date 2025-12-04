# 创建测试数据脚本

Write-Host "=== 创建电影数据库测试数据 ===" -ForegroundColor Green

# API 配置
$baseUrl = "http://localhost:8080"
$authToken = "test-secret-token-12345"

Write-Host "`n[1/3] 创建电影数据..." -ForegroundColor Cyan

# 电影数据
$movies = @(
    @{
        title       = "盗梦空间"
        genre       = "科幻"
        releaseDate = "2010-07-16"
        distributor = "华纳兄弟"
        budget      = 160000000
        mpaRating   = "PG-13"
    },
    @{
        title       = "星际穿越"
        genre       = "科幻"
        releaseDate = "2014-11-07"
        distributor = "派拉蒙影业"
        budget      = 165000000
        mpaRating   = "PG-13"
    },
    @{
        title       = "阿凡达"
        genre       = "科幻"
        releaseDate = "2009-12-18"
        distributor = "20世纪福克斯"
        budget      = 237000000
        mpaRating   = "PG-13"
    },
    @{
        title       = "泰坦尼克号"
        genre       = "爱情"
        releaseDate = "1997-12-19"
        distributor = "派拉蒙影业"
        budget      = 200000000
        mpaRating   = "PG-13"
    },
    @{
        title       = "复仇者联盟4"
        genre       = "动作"
        releaseDate = "2019-04-26"
        distributor = "迪士尼"
        budget      = 356000000
        mpaRating   = "PG-13"
    },
    @{
        title       = "寄生虫"
        genre       = "剧情"
        releaseDate = "2019-10-11"
        distributor = "NEON"
        budget      = 11400000
        mpaRating   = "R"
    },
    @{
        title       = "小丑"
        genre       = "剧情"
        releaseDate = "2019-10-04"
        distributor = "华纳兄弟"
        budget      = 55000000
        mpaRating   = "R"
    },
    @{
        title       = "流浪地球"
        genre       = "科幻"
        releaseDate = "2019-02-05"
        distributor = "CMC Pictures"
        budget      = 50000000
        mpaRating   = "NR"
    }
)

$createdMovies = @()

foreach ($movie in $movies) {
    $body = $movie | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/movies" `
            -Method Post `
            -Headers @{
            "Authorization" = "Bearer $authToken"
            "Content-Type"  = "application/json"
        } `
            -Body $body
        
        Write-Host "  ✓ 创建电影: $($movie.title)" -ForegroundColor Green
        $createdMovies += $response
    }
    catch {
        Write-Host "  ✗ 创建电影失败: $($movie.title) - $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 200
}

Write-Host "`n[2/3] 创建评分数据..." -ForegroundColor Cyan

# 为每部电影创建随机评分
$raters = @("user001", "user002", "user003", "user004", "user005", "user006", "user007", "user008")
$ratings = @(3.5, 4.0, 4.5, 5.0, 3.0, 2.5)

$ratingCount = 0
foreach ($movie in $createdMovies) {
    $numRatings = Get-Random -Minimum 3 -Maximum 7
    
    for ($i = 0; $i -lt $numRatings; $i++) {
        $rater = $raters | Get-Random
        $rating = $ratings | Get-Random
        
        $body = @{ rating = $rating } | ConvertTo-Json
        
        try {
            $encodedTitle = [System.Web.HttpUtility]::UrlEncode($movie.title)
            $response = Invoke-RestMethod -Uri "$baseUrl/movies/$encodedTitle/ratings" `
                -Method Post `
                -Headers @{
                "X-Rater-Id"   = $rater
                "Content-Type" = "application/json"
            } `
                -Body $body
            
            $ratingCount++
        }
        catch {
            # 忽略重复评分错误（同一用户不能重复评分）
        }
        Start-Sleep -Milliseconds 100
    }
}

Write-Host "  ✓ 创建了 $ratingCount 条评分" -ForegroundColor Green

Write-Host "`n[3/3] 验证数据..." -ForegroundColor Cyan

# 获取所有电影
try {
    $allMovies = Invoke-RestMethod -Uri "$baseUrl/movies"
    Write-Host "  ✓ 数据库中共有 $($allMovies.items.Count) 部电影" -ForegroundColor Green
    
    # 显示前3部电影的详细信息
    Write-Host "`n电影列表（前3部）:" -ForegroundColor Yellow
    $allMovies.items | Select-Object -First 3 | ForEach-Object {
        Write-Host "  - $($_.title) ($($_.genre)) - 上映日期: $($_.releaseDate)" -ForegroundColor White
        
        # 获取评分
        $encodedTitle = [System.Web.HttpUtility]::UrlEncode($_.title)
        try {
            $ratingInfo = Invoke-RestMethod -Uri "$baseUrl/movies/$encodedTitle/rating"
            Write-Host "    评分: $($ratingInfo.average) ($($ratingInfo.count) 人评价)" -ForegroundColor Gray
        }
        catch {
            Write-Host "    暂无评分" -ForegroundColor Gray
        }
    }
}
catch {
    Write-Host "  ✗ 获取电影列表失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 测试数据创建完成！===" -ForegroundColor Green
Write-Host "你现在可以访问前端查看数据: http://localhost:5173" -ForegroundColor Yellow
