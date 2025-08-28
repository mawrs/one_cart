'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TopNavigation } from '../components/TopNavigation';
import { useCart } from '../providers/CartProvider';
import { mockProducts, mockSuppliers } from '../data/mockData';
import { generateInvoicePDF, generateOrderSummaryPDF } from '../utils/pdfGenerator';
import { formatDeliveryWindow } from '../utils/deliveryCalculations';
import { Order } from '../types';

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const foundOrder = orders.find(o => o.id === orderId);
    if (!foundOrder) {
      router.push('/orders');
      return;
    }

    setOrder(foundOrder);
  }, [orderId, orders, router]);

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

  const orderItems = order.items.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    const supplier = product ? mockSuppliers.find(s => s.id === product.supplierId) : null;
    return { ...item, product, supplier };
  }).filter(item => item.product && item.supplier);

  const deliveryWindow = {
    start: new Date(order.deliveryWindow.start),
    end: new Date(order.deliveryWindow.end),
    dayOfWeek: new Date(order.deliveryWindow.start).toLocaleDateString('en-US', { weekday: 'long' })
  };

  const handleDownloadInvoice = () => {
    generateInvoicePDF(order);
  };

  const handleDownloadSummary = () => {
    generateOrderSummaryPDF(order);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Your order has been confirmed and suppliers have been notified</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            
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
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-gray-900">${order.totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadInvoice}
                className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Invoice (PDF)
              </button>
              <button
                onClick={handleDownloadSummary}
                className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Summary
              </button>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
            
            {/* Consolidated Delivery Window */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium text-green-900">Consolidated Delivery Window</h3>
              </div>
              <p className="text-lg font-semibold text-green-900">
                {formatDeliveryWindow(deliveryWindow)}
              </p>
              <p className="text-sm text-green-700 mt-1">
                All your items will arrive within this timeframe
              </p>
            </div>

            {/* Supplier Breakdown */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Delivery by Supplier</h3>
              {order.supplierBreakdown.map(supplierOrder => {
                const supplier = mockSuppliers.find(s => s.id === supplierOrder.supplierId);
                if (!supplier) return null;

                return (
                  <div key={supplierOrder.supplierId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                        <p className="text-sm text-gray-600">
                          {supplierOrder.items.length} item{supplierOrder.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${supplierOrder.subtotal.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(supplierOrder.deliveryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            View All Orders
          </Link>
          <Link
            href={`/report-issue?orderId=${order.id}`}
            className="bg-red-100 text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-200 transition-colors text-center"
          >
            Report an Issue
          </Link>
          <Link
            href="/"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Your suppliers have been notified and will begin preparing your order</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>You'll receive delivery notifications as each supplier ships their items</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>All deliveries will arrive within your consolidated delivery window</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>You can track progress and report any issues from your Orders page</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
