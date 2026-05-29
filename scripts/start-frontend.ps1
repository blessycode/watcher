Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location "$PSScriptRoot\..\frontend"
try {
    if (!(Test-Path ".env.local")) {
        "NEXT_PUBLIC_API_URL=http://localhost:8000" | Set-Content -Encoding UTF8 ".env.local"
    }
    npm run dev
}
finally {
    Pop-Location
}
