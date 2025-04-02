$REQUIRED_UV_VERSION = "0.5.4"

# Check if `uv` is installed and on the PATH
if (-not (Get-Command "uv" -ErrorAction SilentlyContinue)) {
    Write-Host "uv could not be found, installing latest version..."
    irm https://astral.sh/uv/install.ps1 | iex
}

# Get installed version
$INSTALLED_UV_VERSION = (uv --version).Split(" ")[1]

# Compare versions
$versionComparison = [version]$INSTALLED_UV_VERSION -lt [version]$REQUIRED_UV_VERSION
if ($versionComparison) {
    Write-Host "uv version must be at least $REQUIRED_UV_VERSION, updating to latest version..."
    irm https://astral.sh/uv/install.ps1 | iex
    # Refresh the PowerShell session to ensure the updated PATH is available
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host "uv is installed and meets the version requirement"