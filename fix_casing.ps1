# PowerShell script to fix casing issues by standardizing on ELearing
$root = "c:\laragon\www\eapp"
$target = "ELearing"
$source = "Elearing"

# Ensure target folder exists as the master
if (-not (Test-Path "$root\$target")) {
    New-Item -ItemType Directory -Path "$root\$target" -Force
}

# Standardize backend files
$backendFiles = @("server.js", "db.js", "migrate.js", "package.json")
foreach ($file in $backendFiles) {
    if (Test-Path "$root\$target\backend\$file") {
        # Touch the file to trigger re-index
        $content = Get-Content "$root\$target\backend\$file" -Raw
        Set-Content "$root\$target\backend\$file" $content -Force
    }
}

Write-Host "Standardized files in $root\$target"
