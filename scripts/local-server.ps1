param(
  [int]$Port = 8080
)

$siteRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\docs"))
$indexPath = Join-Path $siteRoot "index.html"

if (-not (Test-Path $indexPath)) {
  Write-Host "docs\index.html 파일이 없습니다. 완성본 ZIP을 다시 내려받아 주세요."
  exit 1
}

$mimeTypes = @{
  ".css"         = "text/css; charset=utf-8"
  ".html"        = "text/html; charset=utf-8"
  ".js"          = "text/javascript; charset=utf-8"
  ".json"        = "application/json; charset=utf-8"
  ".png"         = "image/png"
  ".svg"         = "image/svg+xml"
  ".webmanifest" = "application/manifest+json; charset=utf-8"
}

$listener = [Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")

try {
  $listener.Start()
  $address = "http://localhost:$Port/"
  Write-Host "강도윤의 휴대전화를 실행했습니다: $address"
  Write-Host "종료하려면 Ctrl+C를 누르세요."
  Start-Process $address

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = [Uri]::UnescapeDataString(
      $context.Request.Url.AbsolutePath.TrimStart("/")
    )

    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $targetPath = [IO.Path]::GetFullPath(
      (Join-Path $siteRoot $requestPath.Replace("/", "\"))
    )

    if (-not $targetPath.StartsWith($siteRoot, [StringComparison]::OrdinalIgnoreCase)) {
      $context.Response.StatusCode = 403
      $context.Response.Close()
      continue
    }

    if (-not (Test-Path $targetPath -PathType Leaf)) {
      $targetPath = $indexPath
    }

    $extension = [IO.Path]::GetExtension($targetPath).ToLowerInvariant()
    $contentType = $mimeTypes[$extension]
    if (-not $contentType) {
      $contentType = "application/octet-stream"
    }

    $bytes = [IO.File]::ReadAllBytes($targetPath)
    $context.Response.StatusCode = 200
    $context.Response.ContentType = $contentType
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.Headers.Add("Cache-Control", "no-cache")
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
  }
}
finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
