'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Submissions() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'UMKM') {
      router.push('/login');
      return;
    }
    // For now, show empty state
    setLoading(false);
  }, [user]);

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

      {submissions.length === 0 ? (
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
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Pengajuan #{submission.id.slice(0, 8)}
                    </h3>
                    {submission.status === 'APPROVED' && (
                      <span className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Disetujui</span>
                      </span>
                    )}
                    {submission.status === 'PENDING' && (
                      <span className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Menunggu</span>
                      </span>
                    )}
                    {submission.status === 'REJECTED' && (
                      <span className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-3 py-1 rounded-full text-sm">
                        <XCircle className="h-4 w-4" />
                        <span>Ditolak</span>
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Diajukan pada {new Date(submission.createdAt).toLocaleDateString('id-ID')}
                  </p>
                  {submission.score && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Skor: </span>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">{submission.score}/100</span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/umkm/submissions/${submission.id}`}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold"
                >
                  Lihat Detail →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
