$movies = @(
    '{"title":"Inception","genre":"Sci-Fi","releaseDate":"2010-07-16","distributor":"Warner Bros.","budget":160000000,"mpaRating":"PG-13"}',
    '{"title":"Interstellar","genre":"Sci-Fi","releaseDate":"2014-11-07","distributor":"Paramount","budget":165000000,"mpaRating":"PG-13"}',
    '{"title":"Avatar","genre":"Sci-Fi","releaseDate":"2009-12-18","distributor":"20th Century Fox","budget":237000000,"mpaRating":"PG-13"}',
    '{"title":"Titanic","genre":"Romance","releaseDate":"1997-12-19","distributor":"Paramount","budget":200000000,"mpaRating":"PG-13"}',
    '{"title":"Avengers Endgame","genre":"Action","releaseDate":"2019-04-26","distributor":"Disney","budget":356000000,"mpaRating":"PG-13"}',
    '{"title":"Parasite","genre":"Drama","releaseDate":"2019-10-11","distributor":"NEON","budget":11400000,"mpaRating":"R"}',
    '{"title":"Joker","genre":"Drama","releaseDate":"2019-10-04","distributor":"Warner Bros.","budget":55000000,"mpaRating":"R"}'
)

Write-Host "Creating movies..." -ForegroundColor Green
foreach ($movie in $movies) {
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/movies" -Method Post -Headers @{"Authorization" = "Bearer test-secret-token-12345"; "Content-Type" = "application/json" } -Body $movie | Out-Null
        Write-Host "." -NoNewline
    }
    catch {
        Write-Host "x" -NoNewline
    }
}

Write-Host "`nCreating ratings..." -ForegroundColor Green
$titles = @("Inception", "Interstellar", "Avatar", "Titanic", "Avengers Endgame", "Parasite", "Joker")
$ratings = @(3.5, 4.0, 4.5, 5.0, 3.0)

foreach ($title in $titles) {
    for ($i = 1; $i -le 5; $i++) {
        $rating = $ratings | Get-Random
        $body = "{`"rating`":$rating}"
        try {
            Invoke-RestMethod -Uri "http://localhost:8080/movies/$title/ratings" -Method Post -Headers @{"X-Rater-Id" = "user00$i"; "Content-Type" = "application/json" } -Body $body | Out-Null
            Write-Host "." -NoNewline
        }
        catch {}
    }
}

Write-Host "`n`nTest data created!" -ForegroundColor Green
$movies = Invoke-RestMethod -Uri "http://localhost:8080/movies"
Write-Host "Total movies in database: $($movies.items.Count)" -ForegroundColor Yellow
