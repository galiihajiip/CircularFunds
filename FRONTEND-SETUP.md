# CircularFund Frontend Setup

## Status
Frontend Next.js sudah dibuat lengkap dengan:
- ✅ Authentication (Login/Register)
- ✅ UMKM Dashboard
- ✅ Investor Browse
- ✅ Submission Form (Circular Economy Scoring)
- ✅ Tailwind CSS styling
- ✅ Zustand state management
- ✅ Axios API integration

## Issue
Next.js 16.1.6 menggunakan Turbopack yang memiliki issue dengan WASM bindings di environment ini.

## Solusi

### Option 1: Downgrade ke Next.js 14 (Recommended)
```bash
cd frontend
npm install next@14 react@18 react-dom@18 --legacy-peer-deps
npm run dev
```

### Option 2: Manual Start (Temporary)
Jika masih error, coba:
```bash
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Option 3: Use Production Build
```bash
cd frontend
npm run build
npm start
```

## Struktur Frontend

```
frontend/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Register page
│   ├── umkm/
│   │   ├── dashboard/page.tsx      # UMKM dashboard
│   │   └── submissions/
│   │       └── new/page.tsx        # New submission form
│   └── investor/
│       └── browse/page.tsx         # Browse UMKMs
├── components/
│   └── Navbar.tsx                  # Navigation bar
├── lib/
│   ├── api.ts                      # Axios instance
│   ├── store.ts                    # Zustand store
│   └── types.ts                    # TypeScript types
└── .env.local                      # Environment variables
```

## Features Implemented

### 1. Landing Page (/)
- Hero section dengan CTA
- Features showcase
- How it works untuk UMKM & Investor

### 2. Authentication
- **Register** (`/register`): Pilih role (UMKM/INVESTOR), email, password
- **Login** (`/login`): Email & password authentication
- Auto-redirect based on role

### 3. UMKM Dashboard (`/umkm/dashboard`)
- Circular score display
- Profile information
- Quick actions (New submission, View submissions, KYC)
- Stats cards

### 4. New Submission (`/umkm/submissions/new`)
- Form lengkap untuk 8 indikator circular economy:
  - Resource Reduction
  - Reuse Practice
  - Recycle Integration
  - Product Durability
  - Process Efficiency
  - Transparency
  - Carbon Avoidance
  - Livelihood Impact
- Real-time score calculation via API

### 5. Investor Browse (`/investor/browse`)
- Browse verified UMKMs
- Filter by score, business type
- Search functionality
- View circular scores & business details

## API Integration

Frontend sudah terintegrasi dengan backend:
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /scoring/calculate` - Calculate circular score
- `GET /investor/umkm` - Browse UMKMs
- `GET /umkm/profile/:userId` - Get UMKM profile

## Environment Variables

File `.env.local` sudah dikonfigurasi:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:5000
```

## Testing Frontend

Setelah frontend running, test flow:
1. Buka http://localhost:3000
2. Register sebagai UMKM
3. Login
4. Submit circular practices
5. Lihat score yang dihitung

## Next Steps

Jika frontend berhasil running:
1. Test registration & login
2. Test submission form
3. Test investor browse
4. Implement KYC pages
5. Add file upload untuk evidence
6. Add investor detail pages

## Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

### Module not found errors
```bash
npm install
```

### Build errors
```bash
rm -rf .next
npm run dev
```
