'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import { useCart } from '../providers/CartProvider';
import { mockProducts, mockSuppliers } from '../data/mockData';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { formatDeliveryWindow } from '../utils/deliveryCalculations';
import { Order } from '../types';

export default function OrdersPage() {
  const { orders, reorder } = useCart();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleReorder = (orderId: string) => {
    reorder(orderId);
    // Could add a toast notification here
  };

  const handleDownloadInvoice = (order: Order) => {
    generateInvoicePDF(order);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h1>
            <p className="text-gray-600 mb-6">Your order history will appear here once you place an order</p>
            <Link
              href="/"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">View and manage your past orders</p>
        </div>

        <div className="space-y-6">
          {orders.map(order => {
            const isExpanded = expandedOrders.has(order.id);
            const deliveryWindow = {
              start: new Date(order.deliveryWindow.start),
              end: new Date(order.deliveryWindow.end),
              dayOfWeek: new Date(order.deliveryWindow.start).toLocaleDateString('en-US', { weekday: 'long' })
            };

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {order.id}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Order Date:</span>
                          <br />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Delivery Window:</span>
                          <br />
                          {formatDeliveryWindow(deliveryWindow)}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <br />
                          <span className="text-lg font-bold text-gray-900">${order.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        <svg 
                          className={`w-4 h-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Supplier Breakdown */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Order Breakdown by Supplier</h4>
                        <div className="space-y-4">
                          {order.supplierBreakdown.map(supplierOrder => {
                            const supplier = mockSuppliers.find(s => s.id === supplierOrder.supplierId);
                            if (!supplier) return null;

                            return (
                              <div key={supplierOrder.supplierId} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h5 className="font-medium text-gray-900">{supplier.name}</h5>
                                    <p className="text-sm text-gray-600">
                                      Delivery: {new Date(supplierOrder.deliveryDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-gray-900">${supplierOrder.subtotal.toFixed(2)}</p>
                                </div>
                                
                                <div className="space-y-2">
                                  {supplierOrder.items.map(item => {
                                    const product = mockProducts.find(p => p.id === item.productId);
                                    if (!product) return null;

                                    return (
                                      <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-gray-700">
                                          {product.name} × {item.quantity}
                                        </span>
                                        <span className="text-gray-900">
                                          ${(product.price * item.quantity).toFixed(2)}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Order Actions</h4>
                        <div className="space-y-3">
                          <button
                            onClick={() => handleReorder(order.id)}
                            className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reorder Items
                          </button>
                          
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Invoice
                          </button>
                          
                          <Link
                            href={`/report-issue?orderId=${order.id}`}
                            className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Report Issue
                          </Link>
                          
                          <Link
                            href={`/confirmation?orderId=${order.id}`}
                            className="w-full text-amber-600 hover:text-amber-700 py-2 px-4 rounded-lg font-medium border border-amber-600 hover:border-amber-700 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-3">Order Summary</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Items:</span>
                              <span className="text-gray-900">
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Suppliers:</span>
                              <span className="text-gray-900">{order.supplierBreakdown.length}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2">
                              <span className="font-medium text-gray-900">Total:</span>
                              <span className="font-bold text-gray-900">${order.totalCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}
