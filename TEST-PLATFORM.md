# CircularFund Platform - Testing Guide

## Services Status

Pastikan semua services running:

```powershell
# Check processes
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*python*"}
```

### Service URLs:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000  
- **AI Service**: http://localhost:5000

## Testing Steps

### 1. Test Backend API

```powershell
# Test register
curl http://localhost:4000/auth/register -Method POST -Body '{"email":"testuser@example.com","password":"Test123!","role":"UMKM"}' -ContentType 'application/json' -UseBasicParsing

# Test login
curl http://localhost:4000/auth/login -Method POST -Body '{"email":"testuser@example.com","password":"Test123!"}' -ContentType 'application/json' -UseBasicParsing

# Test scoring
curl http://localhost:4000/scoring/calculate -Method POST -Body '{"umkmId":"test","resourceReductionPercentage":30,"reuseFrequency":"weekly","recycleType":"comprehensive","productLifespanYears":5,"productRepairability":true,"processEfficiencyImprovement":25,"documentationLevel":"detailed","traceabilitySystem":true,"carbonReductionKg":500,"localEmployees":15,"incomeStability":"stable"}' -ContentType 'application/json' -UseBasicParsing
```

### 2. Test Frontend

1. **Buka browser**: http://localhost:3000
2. **Hard refresh**: Tekan `Ctrl + Shift + R`
3. **Clear cache** (jika perlu):
   - Buka DevTools (F12)
   - Application tab
   - Clear storage
   - Clear site data

### 3. Test User Flow

#### UMKM Flow:
1. Klik "Daftar"
2. Pilih role "UMKM"
3. Isi email & password
4. Login
5. Setup profil bisnis
6. Buat pengajuan baru
7. Lengkapi KYC

#### Investor Flow:
1. Klik "Daftar"
2. Pilih role "INVESTOR"
3. Isi email & password
4. Login
5. Browse bisnis UMKM
6. Filter berdasarkan skor

### 4. Test Features

- ✅ Dark mode toggle (icon bulan/matahari)
- ✅ Hamburger menu (mobile)
- ✅ Responsive design (resize browser)
- ✅ Bahasa Indonesia
- ✅ Favicon CircularFund

## Troubleshooting

### Error: "Failed to fetch"

**Solusi:**
1. Check backend running: `curl http://localhost:4000`
2. Hard refresh browser: `Ctrl + Shift + R`
3. Clear browser cache
4. Restart services

### Error: "umkms.map is not a function"

**Solusi:**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear .next folder: `Remove-Item -Recurse -Force frontend\.next`
3. Restart frontend

### Button tidak bisa diklik

**Solusi:**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Check browser console (F12) untuk errors
3. Disable browser extensions
4. Try incognito mode

## Restart All Services

```batch
# Stop all
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# Start all
start-all.bat
```

Atau manual:

```powershell
# Terminal 1 - AI Service
cd ai-service
python main.py

# Terminal 2 - Backend
cd backend
npm run start:prod

# Terminal 3 - Frontend
cd frontend
npm run dev
```

## Platform Features

### ✅ Completed Features:

1. **Authentication**
   - Register (UMKM & Investor)
   - Login
   - JWT tokens
   - Role-based access

2. **UMKM Features**
   - Dashboard
   - Setup profil bisnis
   - Pengajuan praktik sirkular
   - KYC verification
   - Circular scoring

3. **Investor Features**
   - Browse UMKM
   - Filter by score & type
   - View UMKM details

4. **UI/UX**
   - Bahasa Indonesia
   - Dark mode
   - Responsive (mobile/tablet/desktop)
   - Hamburger menu
   - Custom favicon

5. **Backend**
   - PostgreSQL database
   - TypeORM
   - CORS enabled
   - Validation pipes

6. **AI Service**
   - Evidence validation
   - Confidence scoring
   - FastAPI

## Database

**PostgreSQL**: circularfund
**Password**: Galihajip845

```sql
-- Check tables
\dt

-- Check users
SELECT * FROM users;

-- Check UMKM profiles
SELECT * FROM umkm_profiles;
```

## Notes

- Platform menggunakan PostgreSQL lokal
- Dark mode tersimpan di localStorage
- Auth state tersimpan di localStorage
- Backend port: 4000
- Frontend port: 3000
- AI Service port: 5000
