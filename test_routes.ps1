$pages = @('/en', '/fr', '/en/products', '/fr/products', '/en/cart', '/en/admin-login', '/en/about', '/en/admin')
foreach ($p in $pages) {
  try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 10
    Write-Host "$p -> $($r.StatusCode)"
  } catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) { Write-Host "$p -> $statusCode" } else { Write-Host "$p -> ERROR: $_" }
  }
}
