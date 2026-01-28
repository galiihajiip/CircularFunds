'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText } from 'lucide-react';

export default function Submissions() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'UMKM') {
      router.push('/login');
      return;
    }
    // For now, show empty state
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/umkm/dashboard"
        className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengajuan Saya</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Lacak pengajuan praktik ekonomi sirkular Anda</p>
        </div>
        <Link
          href="/umkm/submissions/new"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Pengajuan Baru</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Belum Ada Pengajuan</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Mulai dokumentasikan praktik ekonomi sirkular Anda untuk mendapatkan skor
        </p>
        <Link
          href="/umkm/submissions/new"
          className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="h-5 w-5" />
          <span>Buat Pengajuan Pertama</span>
        </Link>
      </div>
    </div>
  );
}
