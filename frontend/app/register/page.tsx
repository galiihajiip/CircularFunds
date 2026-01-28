'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { Leaf, Mail, Lock } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'UMKM' as 'UMKM' | 'INVESTOR',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    if (formData.password.length < 8) {
      setError('Kata sandi minimal 8 karakter');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setAuth(data.user, data.accessToken, data.refreshToken);
      
      if (data.user.role === 'UMKM') {
        router.push('/umkm/dashboard');
      } else {
        router.push('/investor/browse');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Buat Akun</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Bergabung dengan CircularFund hari ini</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Saya adalah...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'UMKM' })}
                className={`p-4 rounded-lg border-2 transition ${
                  formData.role === 'UMKM'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Bisnis</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">UMKM</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'INVESTOR' })}
                className={`p-4 rounded-lg border-2 transition ${
                  formData.role === 'INVESTOR'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Investor</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Pemberi Pinjaman</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="anda@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Min. 8 karakter"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Konfirmasi kata sandi"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Membuat Akun...' : 'Buat Akun'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
