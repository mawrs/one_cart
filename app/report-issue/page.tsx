'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TopNavigation } from '../components/TopNavigation';
import { useCart } from '../providers/CartProvider';
import { mockProducts, mockSuppliers } from '../data/mockData';
import { QualityIssue, Order } from '../types';

function ReportIssueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, reportIssue } = useCart();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [issueType, setIssueType] = useState<'missing' | 'damaged' | 'wrong'>('missing');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/orders');
      return;
    }

    const foundOrder = orders.find(o => o.id === orderId);
    if (!foundOrder) {
      router.push('/orders');
      return;
    }

    setOrder(foundOrder);
  }, [orderId, orders, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order || !description.trim()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const issue: QualityIssue = {
      orderId: order.id,
      issueType,
      description: description.trim(),
      reportDate: new Date().toISOString()
    };

    reportIssue(issue);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue Reported Successfully</h1>
            <p className="text-gray-600 mb-8">
              We&apos;ve received your report and will follow up with the supplier. You&apos;ll be contacted if we need additional information.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Back to Orders
              </Link>
              <Link
                href="/"
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const orderItems = order.items.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    const supplier = product ? mockSuppliers.find(s => s.id === product.supplierId) : null;
    return { ...item, product, supplier };
  }).filter(item => item.product && item.supplier);

  const issueTypes = [
    {
      value: 'missing' as const,
      label: 'Missing Items',
      description: 'Some items from your order were not delivered',
      icon: '📦'
    },
    {
      value: 'damaged' as const,
      label: 'Damaged/Stale Items',
      description: 'Items arrived damaged, stale, or expired',
      icon: '⚠️'
    },
    {
      value: 'wrong' as const,
      label: 'Wrong Items',
      description: 'You received different items than what you ordered',
      icon: '🔄'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Let us know about any problems with your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium text-gray-900">${order.totalCost.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Items in this order:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {orderItems.map(item => (
                  <div key={item.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.product!.name}</p>
                      <p className="text-xs text-gray-600">{item.supplier!.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">×{item.quantity}</p>
                      <p className="text-xs text-gray-600">
                        ${(item.product!.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Issue Report Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Issue</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of issue are you experiencing?
                </label>
                <div className="space-y-3">
                  {issueTypes.map(type => (
                    <label key={type.value} className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="issueType"
                        value={type.value}
                        checked={issueType === type.value}
                        onChange={(e) => setIssueType(e.target.value as any)}
                        className="mt-1 mr-3 text-amber-600 focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-2">{type.icon}</span>
                          <span className="font-medium text-gray-900">{type.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe the issue in detail
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Provide specific details about the issue, including which items were affected, when you noticed the problem, and any other relevant information..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The more details you provide, the better we can assist you.
                </p>
              </div>

              {/* Contact Information Note */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
                    <p className="text-sm text-blue-700">
                      We&apos;ll review your report and work with the supplier to resolve the issue. 
                      For this demo, the issue will be logged locally.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <Link
                  href="/orders"
                  className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!description.trim() || isSubmitting}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReportIssuePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    }>
      <ReportIssueContent />
    </Suspense>
  );
}
