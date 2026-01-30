'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { TrendingUp, Award, FileText, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function UmkmDashboard() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<{
    circularScore?: number;
    isVerified?: boolean;
    businessName?: string;
    businessType?: string;
    location?: string;
    employeeCount?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for hydration to complete
    if (!isHydrated) return;
    
    // Check auth after hydration
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'UMKM') {
      router.push('/login');
      return;
    }
    
    // Try to fetch profile, but don't fail if backend is down (demo mode)
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, isHydrated]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/umkm/profile/${user?.id}`);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Demo mode: Set dummy profile
      setProfile({
        circularScore: 0,
        isVerified: false,
        businessName: 'Demo Business',
        businessType: 'Demo Type',
        location: 'Demo Location',
        employeeCount: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard UMKM</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Selamat datang kembali, {user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Skor Sirkular</span>
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {profile?.circularScore || 0}
            <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400">/100</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {(profile?.circularScore ?? 0) >= 70 ? 'Sangat Baik' : (profile?.circularScore ?? 0) >= 50 ? 'Baik' : 'Berkembang'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Pengajuan</span>
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">0</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total pengajuan</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Dilihat</span>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">0</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bulan ini</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Verifikasi</span>
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {profile?.isVerified ? 'Terverifikasi' : 'Menunggu'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Status KYC</div>
        </div>
      </div>

      {/* Profile Section */}
      {!profile ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-0 sm:mr-3 flex-shrink-0 mb-3 sm:mb-0" />
            <div className="flex-1 w-full">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lengkapi Profil Anda</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Buat profil bisnis untuk mulai menerima peluang pendanaan
              </p>
              <Link
                href="/umkm/profile/setup"
                className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm sm:text-base"
              >
                <Plus className="h-4 w-4" />
                <span>Setup Profil</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profil Bisnis</h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Nama Bisnis</label>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.businessName || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Jenis Bisnis</label>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.businessType || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Lokasi</label>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.location || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Karyawan</label>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.employeeCount || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/umkm/submissions/new"
          className="bg-green-600 text-white p-4 sm:p-6 rounded-xl hover:bg-green-700 transition"
        >
          <Plus className="h-6 w-6 sm:h-8 sm:w-8 mb-3" />
          <h3 className="font-semibold text-base sm:text-lg mb-2">Pengajuan Baru</h3>
          <p className="text-green-100 text-xs sm:text-sm">Ajukan praktik ekonomi sirkular</p>
        </Link>

        <Link
          href="/umkm/submissions"
          className="bg-blue-600 text-white p-4 sm:p-6 rounded-xl hover:bg-blue-700 transition"
        >
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 mb-3" />
          <h3 className="font-semibold text-base sm:text-lg mb-2">Lihat Pengajuan</h3>
          <p className="text-blue-100 text-xs sm:text-sm">Lacak riwayat pengajuan Anda</p>
        </Link>

        <Link
          href="/umkm/kyc"
          className="bg-purple-600 text-white p-4 sm:p-6 rounded-xl hover:bg-purple-700 transition sm:col-span-2 lg:col-span-1"
        >
          <Award className="h-6 w-6 sm:h-8 sm:w-8 mb-3" />
          <h3 className="font-semibold text-base sm:text-lg mb-2">Lengkapi KYC</h3>
          <p className="text-purple-100 text-xs sm:text-sm">Verifikasi identitas bisnis Anda</p>
        </Link>
      </div>
    </div>
  );
}
