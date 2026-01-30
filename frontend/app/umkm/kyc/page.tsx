'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { ArrowLeft, Save, Loader, Shield, Camera, Upload, Sparkles } from 'lucide-react';
import Link from 'next/link';
import KYCCamera from '@/components/KYCCamera';
import { extractKTPData } from '@/lib/ocr';

export default function UmkmKyc() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'ktp' | 'selfie'>('ktp');
  const [ktpImage, setKtpImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phoneNumber: '',
    address: '',
    businessName: '',
    businessType: '',
    businessAddress: '',
    annualRevenue: 0,
    employeeCount: 0,
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
  });

  const openCamera = (mode: 'ktp' | 'selfie') => {
    setCameraMode(mode);
    setShowCamera(true);
  };

  const handleCameraCapture = async (imageData: string) => {
    if (cameraMode === 'ktp') {
      setKtpImage(imageData);
      // Auto-fill form with OCR
      setOcrLoading(true);
      try {
        const ktpData = await extractKTPData(imageData);
        setFormData(prev => ({
          ...prev,
          fullName: ktpData.nama || prev.fullName,
          idNumber: ktpData.nik || prev.idNumber,
          address: ktpData.alamat || prev.address,
        }));
      } catch (err) {
        console.error('OCR error:', err);
      } finally {
        setOcrLoading(false);
      }
    } else {
      setSelfieImage(imageData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const kycData = {
        userId: user?.id,
        ...formData,
      };

      await api.post('/kyc/business-owner', kycData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/umkm/dashboard');
      }, 2000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal mengirim KYC');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12">
          <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">KYC Berhasil Dikirim!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Aplikasi KYC Anda sedang ditinjau. Anda akan diberitahu setelah disetujui.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/umkm/dashboard"
        className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Pemilik Bisnis</h1>
            <p className="text-gray-600 dark:text-gray-400">Lengkapi verifikasi untuk akses pendanaan</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Document Upload Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Dokumen Verifikasi</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* KTP Photo */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {ktpImage ? (
                  <div className="space-y-3">
                    <img src={ktpImage} alt="KTP" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => openCamera('ktp')}
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                    >
                      Foto Ulang
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Foto KTP</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ambil foto KTP Anda</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCamera('ktp')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Buka Kamera</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Selfie with KTP */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {selfieImage ? (
                  <div className="space-y-3">
                    <img src={selfieImage} alt="Selfie" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => openCamera('selfie')}
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                    >
                      Foto Ulang
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Selfie dengan KTP</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Foto diri memegang KTP</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCamera('selfie')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Buka Kamera</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {ocrLoading && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>Membaca data KTP dengan OCR...</span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Informasi Pribadi</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor KTP *
                </label>
                <input
                  type="text"
                  required
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+628123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Informasi Bisnis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Bisnis *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Bisnis *
                </label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih jenis</option>
                  <option value="Manufaktur">Manufaktur</option>
                  <option value="Retail">Retail</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat Bisnis *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pendapatan Tahunan (IDR) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.annualRevenue}
                  onChange={(e) => setFormData({ ...formData, annualRevenue: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jumlah Karyawan *
                </label>
                <input
                  type="number"
                  required
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Informasi Bank</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Bank *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor Rekening *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Pemegang Rekening *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Kirim KYC</span>
                </>
              )}
            </button>
            <Link
              href="/umkm/dashboard"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <KYCCamera
          mode={cameraMode}
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
