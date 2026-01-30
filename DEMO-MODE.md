# Demo Mode - CircularFund

## Cara Menggunakan Demo Mode

Demo Mode memungkinkan Anda untuk mengeksplorasi semua fitur CircularFund tanpa perlu registrasi atau backend yang aktif.

### Akses Demo Mode

Ada 2 cara untuk masuk ke Demo Mode:

1. **Dari Homepage**
   - Klik tombol **"Demo Mode"** (ungu dengan ikon petir) di hero section
   - Langsung masuk ke dashboard UMKM

2. **Dari Navbar**
   - Klik tombol **"Demo"** di navbar (desktop atau mobile)
   - Langsung masuk ke dashboard UMKM

### Fitur yang Tersedia di Demo Mode

✅ **Dashboard UMKM**
- Lihat statistik dummy
- Akses semua menu navigasi
- Profil bisnis demo

✅ **Pengajuan Praktik Sirkular**
- Isi form lengkap dengan 8 indikator
- Hitung skor otomatis (60-90)
- Lihat hasil dalam kotak berwarna
- Skor hijau (80+), oranye (60-79), merah (<60)

✅ **KYC dengan Kamera**
- Buka kamera realtime
- Foto KTP dengan guide frame
- Foto selfie dengan KTP
- OCR auto-fill data KTP
- Switch kamera depan/belakang

✅ **Semua Form**
- Isi data tanpa validasi backend
- Submit berhasil otomatis
- Redirect ke halaman yang sesuai

### Teknologi Demo Mode

- **Auto-login**: Set dummy user di localStorage
- **Fallback API**: Jika backend error, gunakan data dummy
- **OCR Simulation**: Generate data KTP random
- **Score Calculation**: Random score 60-90 dengan rekomendasi

### User Demo

```javascript
{
  id: 'demo-user-[timestamp]',
  email: 'demo@circularfund.com',
  role: 'UMKM'
}
```

### Catatan

- Demo mode tidak menyimpan data ke database
- Semua data hilang setelah logout atau refresh
- Perfect untuk presentasi dan testing UI/UX
- Tidak memerlukan backend aktif

### Keluar dari Demo Mode

Klik tombol **"Keluar"** di navbar untuk logout dan kembali ke homepage.
