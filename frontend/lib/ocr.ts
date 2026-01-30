// Simple OCR simulation for KTP
// In production, you would use Tesseract.js or cloud OCR service

export interface KTPData {
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  rtRw: string;
  kelDesa: string;
  kecamatan: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
}

export async function extractKTPData(imageData: string): Promise<Partial<KTPData>> {
  // Simulate OCR processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Demo mode: Return sample data
  // In production, this would use actual OCR library like Tesseract.js
  const demoData: Partial<KTPData> = {
    nik: generateRandomNIK(),
    nama: 'NAMA SESUAI KTP',
    tempatLahir: 'JAKARTA',
    tanggalLahir: '01-01-1990',
    jenisKelamin: 'LAKI-LAKI',
    alamat: 'JL. CONTOH NO. 123',
    rtRw: '001/002',
    kelDesa: 'KELURAHAN CONTOH',
    kecamatan: 'KECAMATAN CONTOH',
    agama: 'ISLAM',
    statusPerkawinan: 'BELUM KAWIN',
    pekerjaan: 'WIRASWASTA',
    kewarganegaraan: 'WNI',
  };

  return demoData;
}

function generateRandomNIK(): string {
  // Generate random 16-digit NIK
  let nik = '';
  for (let i = 0; i < 16; i++) {
    nik += Math.floor(Math.random() * 10);
  }
  return nik;
}

// For production, install and use Tesseract.js:
// npm install tesseract.js
/*
import Tesseract from 'tesseract.js';

export async function extractKTPDataWithTesseract(imageData: string): Promise<Partial<KTPData>> {
  const { data: { text } } = await Tesseract.recognize(imageData, 'ind', {
    logger: m => console.log(m)
  });

  // Parse the OCR text to extract KTP fields
  const ktpData: Partial<KTPData> = {};
  
  // Extract NIK (16 digits)
  const nikMatch = text.match(/\b\d{16}\b/);
  if (nikMatch) ktpData.nik = nikMatch[0];
  
  // Extract other fields using regex patterns
  // ... add more parsing logic
  
  return ktpData;
}
*/
