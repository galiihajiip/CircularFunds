# CircularFund API Test Script
Write-Host "`n=== CircularFund API Testing ===" -ForegroundColor Cyan

# Test 1: Register UMKM
Write-Host "`n[1] Testing UMKM Registration..." -ForegroundColor Yellow
$umkmReg = @{
    email = "umkm$(Get-Random)@test.com"
    password = "Test123!"
    role = "UMKM"
} | ConvertTo-Json
$umkmResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/register" -Method POST -ContentType "application/json" -Body $umkmReg
Write-Host "Success: UMKM Registered - $($umkmResponse.user.email)" -ForegroundColor Green
$umkmToken = $umkmResponse.accessToken
$umkmId = $umkmResponse.user.id

# Test 2: Register Investor
Write-Host "`n[2] Testing Investor Registration..." -ForegroundColor Yellow
$investorReg = @{
    email = "investor$(Get-Random)@test.com"
    password = "Test123!"
    role = "INVESTOR"
} | ConvertTo-Json
$investorResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/register" -Method POST -ContentType "application/json" -Body $investorReg
Write-Host "Success: Investor Registered - $($investorResponse.user.email)" -ForegroundColor Green

# Test 3: Login
Write-Host "`n[3] Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = $umkmResponse.user.email
    password = "Test123!"
} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -ContentType "application/json" -Body $loginData
Write-Host "Success: Login Successful" -ForegroundColor Green

# Test 4: Scoring Calculation
Write-Host "`n[4] Testing Circular Scoring..." -ForegroundColor Yellow
$scoringData = @{
    umkmId = $umkmId
    resourceReductionPercentage = 35
    reuseFrequency = "weekly"
    recycleType = "comprehensive"
    productLifespanYears = 7
    productRepairability = $true
    processEfficiencyImprovement = 30
    documentationLevel = "detailed"
    traceabilitySystem = $true
    carbonReductionKg = 800
    localEmployees = 20
    incomeStability = "stable"
} | ConvertTo-Json
$scoreResponse = Invoke-RestMethod -Uri "http://localhost:4000/scoring/calculate" -Method POST -ContentType "application/json" -Body $scoringData
Write-Host "Success: Total Score $($scoreResponse.totalScore)/100 - $($scoreResponse.recommendation)" -ForegroundColor Green

# Test 5: AI Service Validation
Write-Host "`n[5] Testing AI Validation Service..." -ForegroundColor Yellow
$aiData = @{
    indicator = "carbon_footprint"
    value = 75
    evidence = "Reduced emissions by 30% through renewable energy"
} | ConvertTo-Json
$aiResponse = Invoke-RestMethod -Uri "http://localhost:5000/validate" -Method POST -ContentType "application/json" -Body $aiData
Write-Host "Success: AI Validation - Valid=$($aiResponse.isValid), Confidence=$($aiResponse.confidence)" -ForegroundColor Green

Write-Host "`n=== All Tests Passed! ===" -ForegroundColor Cyan
