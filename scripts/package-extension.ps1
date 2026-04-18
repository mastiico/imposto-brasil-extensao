$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $root "dist"
$zipPath = Join-Path $distDir "imposto-brasil-chrome-web-store.zip"
$stagingDir = Join-Path $distDir "package"

if (Test-Path $stagingDir) {
  Remove-Item -Recurse -Force $stagingDir
}

if (Test-Path $zipPath) {
  Remove-Item -Force $zipPath
}

New-Item -ItemType Directory -Force -Path $distDir | Out-Null
New-Item -ItemType Directory -Force -Path $stagingDir | Out-Null

$includePaths = @(
  "assets",
  "content",
  "IBPT",
  "manifest.json",
  "overlay.css",
  "popup.html"
)

foreach ($relativePath in $includePaths) {
  $source = Join-Path $root $relativePath

  if (-not (Test-Path $source)) {
    throw "Caminho obrigatorio ausente: $relativePath"
  }

  Copy-Item -Recurse -Force $source $stagingDir
}

Compress-Archive -Path (Join-Path $stagingDir "*") -DestinationPath $zipPath -Force
Write-Host "Pacote gerado em: $zipPath"
