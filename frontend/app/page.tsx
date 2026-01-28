'use client';

import Link from 'next/link';
import { Leaf, TrendingUp, Shield, Users, ArrowRight, Recycle, Award, BarChart3, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900 py-16 sm:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Platform Pendanaan Ekonomi Sirkular</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Danai <span className="text-green-600 dark:text-green-400">Ekonomi Sirkular</span> Indonesia
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Menghubungkan UMKM berkelanjutan dengan investor berdampak. Dukung praktik ekonomi sirkular 
                dan dapatkan keuntungan sambil memberikan dampak positif bagi lingkungan.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-8 py-4 rounded-xl font-semibold border-2 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700 transition"
                >
                  Masuk
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">8</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Indikator Sirkular</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">AI</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Scoring System</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Terverifikasi</div>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-96">
                {/* Circular Economy Illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80">
                    {/* Center Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                        <Recycle className="h-16 w-16 text-white animate-spin-slow" />
                      </div>
                    </div>
                    
                    {/* Orbiting Icons */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                        <Leaf className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow delay-500">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow delay-1000">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow delay-1500">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mengapa CircularFund?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Platform terpercaya untuk menghubungkan bisnis berkelanjutan dengan investor berdampak
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-green-900/20 p-6 sm:p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Leaf className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Fokus Ekonomi Sirkular</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Sistem scoring berbasis AI mengevaluasi bisnis pada 8 indikator ekonomi sirkular, 
                memastikan praktik keberlanjutan yang autentik.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-blue-900/20 p-6 sm:p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Investasi Berdampak</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Investasi pada bisnis berkelanjutan terverifikasi dan lacak keuntungan finansial 
                serta metrik dampak lingkungan secara real-time.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/20 p-6 sm:p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Aman & Terverifikasi</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Verifikasi KYC lengkap, akun RDN, dan scoring berbasis bukti yang transparan 
                untuk kepercayaan dan keamanan maksimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cara Kerja Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Proses mudah untuk memulai perjalanan ekonomi sirkular Anda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* For UMKM */}
            <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">Untuk UMKM</h3>
              </div>
              <ol className="space-y-4">
                {[
                  { num: 1, title: 'Daftar & Lengkapi KYC', desc: 'Verifikasi identitas bisnis dan dapatkan akun RDN' },
                  { num: 2, title: 'Ajukan Praktik Sirkular', desc: 'Dokumentasikan inisiatif keberlanjutan dengan bukti' },
                  { num: 3, title: 'Dapatkan Skor AI', desc: 'Terima skor kesiapan sirkular (0-100)' },
                  { num: 4, title: 'Terima Pendanaan', desc: 'Terhubung dengan investor dan berkembang berkelanjutan' },
                ].map((step) => (
                  <li key={step.num} className="flex items-start group">
                    <span className="flex-shrink-0 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 group-hover:scale-110 transition-transform">
                      {step.num}
                    </span>
                    <div>
                      <strong className="text-gray-900 dark:text-white">{step.title}</strong>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* For Investors */}
            <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">Untuk Investor</h3>
              </div>
              <ol className="space-y-4">
                {[
                  { num: 1, title: 'Daftar & Lengkapi KYC', desc: 'Verifikasi identitas Anda sebagai pemberi pinjaman' },
                  { num: 2, title: 'Jelajahi Bisnis Terverifikasi', desc: 'Filter berdasarkan skor, industri, dan metrik dampak' },
                  { num: 3, title: 'Tinjau Bukti', desc: 'Lihat praktik ekonomi sirkular dan skor detail' },
                  { num: 4, title: 'Investasi Berdampak', desc: 'Danai bisnis berkelanjutan dan lacak dampaknya' },
                ].map((step) => (
                  <li key={step.num} className="flex items-start group">
                    <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 group-hover:scale-110 transition-transform">
                      {step.num}
                    </span>
                    <div>
                      <strong className="text-gray-900 dark:text-white">{step.title}</strong>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap Membuat Dampak?
          </h2>
          <p className="text-green-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan CircularFund hari ini dan jadilah bagian dari revolusi ekonomi sirkular Indonesia
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <Users className="h-5 w-5" />
            <span>Bergabung Sekarang</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
