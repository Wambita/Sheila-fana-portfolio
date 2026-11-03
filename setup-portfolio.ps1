
# ==========================================
# SHEILA FANA PORTFOLIO - PROJECT SCAFFOLDER
# ==========================================

# Use the folder containing this script as project root
$ProjectRoot = $PSScriptRoot

Write-Host "`nSetting up Sheila Fana Portfolio..." -ForegroundColor Cyan

# Define directory structure
$Directories = @(
    "docs",
    "public",
    "src",
    "src/app",
    "src/components",
    "src/features",
    "src/lib",
    "src/styles",
    "src/types"
)

# Create directories
foreach ($Directory in $Directories) {
    $Path = Join-Path $ProjectRoot $Directory

    if (!(Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "[CREATED] $Directory" -ForegroundColor Green
    }
    else {
        Write-Host "[EXISTS]  $Directory" -ForegroundColor Yellow
    }
}

# Documentation files
$DocumentationFiles = @(
    "00-project-overview.md",
    "01-problem-statement.md",
    "02-project-requirements.md",
    "03-information-architecture.md",
    "04-user-personas-and-journeys.md",
    "05-design-system.md",
    "06-technical-architecture.md",
    "07-database-design.md",
    "08-development-plan.md",
    "09-testing-and-quality-assurance.md",
    "10-project-retrospective.md"
)

# Create documentation files
foreach ($File in $DocumentationFiles) {
    $FilePath = Join-Path (Join-Path $ProjectRoot "docs") $File

    if (!(Test-Path $FilePath)) {
        New-Item -ItemType File -Path $FilePath | Out-Null
        Write-Host "[CREATED] docs/$File" -ForegroundColor Green
    }
    else {
        Write-Host "[EXISTS]  docs/$File" -ForegroundColor Yellow
    }
}

# Create README if missing
$ReadmePath = Join-Path $ProjectRoot "README.md"

if (!(Test-Path $ReadmePath)) {
    @"
# Sheila Fana | Personal Portfolio

A personal portfolio showcasing software development,
UI/UX design, cybersecurity, AI, robotics, and emerging technologies.

## Project Documentation

See the [docs](./docs) directory for project planning,
requirements, architecture, design, and development documentation.

## Project Structure

- docs/ - Project documentation
- public/ - Static assets
- src/ - Application source code
- src/app/ - Application entry points
- src/components/ - Reusable UI components
- src/features/ - Feature-specific modules
- src/lib/ - Utilities and libraries
- src/styles/ - Global styles
- src/types/ - TypeScript definitions
"@ | Set-Content -Path $ReadmePath -Encoding UTF8

    Write-Host "[CREATED] README.md" -ForegroundColor Green
}
else {
    Write-Host "[EXISTS]  README.md" -ForegroundColor Yellow
}

# Completion message
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "PROJECT STRUCTURE SETUP COMPLETE!" -ForegroundColor Green
Write-Host "Project: $ProjectRoot" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Display resulting structure
Write-Host "`nYour project structure:" -ForegroundColor Cyan
tree $ProjectRoot /F
