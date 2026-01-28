'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import Link from 'next/link';

export default function NewSubmission() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    resourceReductionPercentage: 0,
    reuseFrequency: 'never',
    recycleType: 'none',
    productLifespanYears: 1,
    productRepairability: false,
    processEfficiencyImprovement: 0,
    documentationLevel: 'none',
    traceabilitySystem: false,
    carbonReductionKg: 0,
    localEmployees: 0,
    incomeStability: 'unstable',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Calculate score first
      const scoreData = {
        umkmId: user?.id,
        ...formData,
      };
      
      const { data } = await api.post('/scoring/calculate', scoreData);
      
      // Show results
      alert(`Score calculated! Total: ${data.totalScore}/100 - ${data.recommendation}`);
      router.push('/umkm/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/umkm/dashboard"
        className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Circular Practice Submission</h1>
        <p className="text-gray-600 mb-8">
          Document your circular economy practices to receive a score
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resource Reduction */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resource Reduction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Reduction Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.resourceReductionPercentage}
                  onChange={(e) => setFormData({ ...formData, resourceReductionPercentage: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Reuse Practice */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Reuse Practice</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reuse Frequency
              </label>
              <select
                value={formData.reuseFrequency}
                onChange={(e) => setFormData({ ...formData, reuseFrequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="sometimes">Sometimes</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>

          {/* Recycle Integration */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recycle Integration</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recycling Type
              </label>
              <select
                value={formData.recycleType}
                onChange={(e) => setFormData({ ...formData, recycleType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="none">None</option>
                <option value="basic">Basic</option>
                <option value="moderate">Moderate</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
          </div>

          {/* Product Durability */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product Durability</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Lifespan (years)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.productLifespanYears}
                  onChange={(e) => setFormData({ ...formData, productLifespanYears: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Repairability
                </label>
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    checked={formData.productRepairability}
                    onChange={(e) => setFormData({ ...formData, productRepairability: e.target.checked })}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Products are repairable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Process Efficiency */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Process Efficiency</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efficiency Improvement (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.processEfficiencyImprovement}
                onChange={(e) => setFormData({ ...formData, processEfficiencyImprovement: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Transparency */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Transparency</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentation Level
                </label>
                <select
                  value={formData.documentationLevel}
                  onChange={(e) => setFormData({ ...formData, documentationLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="none">None</option>
                  <option value="basic">Basic</option>
                  <option value="detailed">Detailed</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traceability System
                </label>
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    checked={formData.traceabilitySystem}
                    onChange={(e) => setFormData({ ...formData, traceabilitySystem: e.target.checked })}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Has traceability system</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Avoidance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Carbon Avoidance</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carbon Reduction (kg CO2)
              </label>
              <input
                type="number"
                min="0"
                value={formData.carbonReductionKg}
                onChange={(e) => setFormData({ ...formData, carbonReductionKg: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Livelihood Impact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Livelihood Impact</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Employees
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.localEmployees}
                  onChange={(e) => setFormData({ ...formData, localEmployees: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Stability
                </label>
                <select
                  value={formData.incomeStability}
                  onChange={(e) => setFormData({ ...formData, incomeStability: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="unstable">Unstable</option>
                  <option value="moderate">Moderate</option>
                  <option value="stable">Stable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Calculate Score</span>
                </>
              )}
            </button>
            <Link
              href="/umkm/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
