'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RotateCw } from 'lucide-react';

interface KYCCameraProps {
  mode: 'ktp' | 'selfie';
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function KYCCamera({ mode, onCapture, onClose }: KYCCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === 'ktp' ? 'Foto KTP' : 'Foto Selfie dengan KTP'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {mode === 'ktp' ? (
                <div className="relative">
                  {/* KTP Frame */}
                  <div className="w-80 h-52 border-4 border-white rounded-lg shadow-2xl">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold">
                      Posisikan KTP di dalam frame
                    </div>
                  </div>
                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                </div>
              ) : (
                <div className="relative">
                  {/* Selfie Frame */}
                  <div className="w-64 h-80 border-4 border-white rounded-full shadow-2xl">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap">
                      Posisikan wajah & KTP
                    </div>
                  </div>
                  {/* Face Guide */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-48 h-48 border-4 border-green-500 rounded-full opacity-50"></div>
                  {/* KTP Guide */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-20 border-2 border-yellow-400 rounded-lg">
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
                      KTP di sini
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-32 left-0 right-0 px-4">
              <div className="bg-black/70 text-white p-4 rounded-lg max-w-md mx-auto">
                <ul className="text-sm space-y-2">
                  {mode === 'ktp' ? (
                    <>
                      <li>✓ Pastikan KTP terlihat jelas</li>
                      <li>✓ Hindari pantulan cahaya</li>
                      <li>✓ Semua teks harus terbaca</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Wajah terlihat jelas</li>
                      <li>✓ Pegang KTP di depan dada</li>
                      <li>✓ KTP harus terbaca</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        {!capturedImage ? (
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={switchCamera}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition"
            >
              <RotateCw className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={capturePhoto}
              className="p-6 bg-white hover:bg-gray-200 rounded-full transition shadow-lg"
            >
              <Camera className="h-8 w-8 text-gray-900" />
            </button>
            <div className="w-16"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={retakePhoto}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              <RotateCw className="h-5 w-5" />
              <span>Foto Ulang</span>
            </button>
            <button
              onClick={confirmPhoto}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Check className="h-5 w-5" />
              <span>Gunakan Foto</span>
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
