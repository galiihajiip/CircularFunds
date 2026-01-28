'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Search, Filter, MapPin, Users, TrendingUp, Award } from 'lucide-react';

export default function KreditorBrowse() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [umkms, setUmkms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minScore: 0,
    businessType: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'KREDITOR') {
      router.push('/login');
      return;
    }
    fetchUmkms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const fetchUmkms = async () => {
    try {
      const { data } = await api.get('/kreditor/umkm', { params: filters });
      // Ensure we always set an array
      const umkmList = data?.data || data || [];
      setUmkms(Array.isArray(umkmList) ? umkmList : []);
    } catch (err) {
      console.error('Failed to fetch UMKMs:', err);
      setUmkms([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Sangat Baik';
    if (score >= 50) return 'Baik';
    return 'Berkembang';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Jelajahi Bisnis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Temukan bisnis berkelanjutan untuk didanai</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cari
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Cari bisnis..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Skor Minimum
            </label>
            <select
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={0}>Semua Skor</option>
              <option value={50}>50+ (Baik)</option>
              <option value={70}>70+ (Sangat Baik)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jenis Bisnis
            </label>
            <select
              value={filters.businessType}
              onChange={(e) => setFilters({ ...filters, businessType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Semua Jenis</option>
              <option value="Manufaktur">Manufaktur</option>
              <option value="Retail">Retail</option>
              <option value="Jasa">Jasa</option>
              <option value="Pertanian">Pertanian</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchUmkms}
          className="mt-4 w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Terapkan Filter</span>
        </button>
      </div>

      {/* UMKM List */}
      {umkms.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 sm:p-12 text-center">
          <Award className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Tidak Ada Bisnis Ditemukan</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Coba sesuaikan filter Anda atau periksa kembali nanti</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {umkms.map((umkm) => (
            <div
              key={umkm.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
              onClick={() => router.push(`/kreditor/umkm/${umkm.id}`)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {umkm.businessName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{umkm.businessType}</p>
                  </div>
                  {umkm.isVerified && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                      Terverifikasi
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {umkm.description || 'Tidak ada deskripsi'}
                </p>

                <div className="space-y-2 mb-4">
                  {umkm.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{umkm.location}</span>
                    </div>
                  )}
                  {umkm.employeeCount && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      {umkm.employeeCount} karyawan
                    </div>
                  )}
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skor Sirkular</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(umkm.circularScore || 0)}`}>
                        {umkm.circularScore || 0}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getScoreLabel(umkm.circularScore || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 sm:px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Lihat Detail</span>
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
