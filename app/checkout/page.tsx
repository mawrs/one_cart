'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TopNavigation } from '../components/TopNavigation';
import { useCart } from '../providers/CartProvider';
import { mockProducts, mockSuppliers } from '../data/mockData';
import { 
  calculateSupplierDeliveries, 
  calculateConsolidatedDeliveryWindow,
  formatDeliveryWindow,
  findOptimalDeliveryDay
} from '../utils/deliveryCalculations';
import { Order } from '../types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, placeOrder } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartItems = cart.items.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    const supplier = product ? mockSuppliers.find(s => s.id === product.supplierId) : null;
    return { ...item, product, supplier };
  }).filter(item => item.product && item.supplier);

  // Group items by supplier
  const itemsBySupplier = cartItems.reduce((acc, item) => {
    const supplierId = item.supplier!.id;
    if (!acc[supplierId]) {
      acc[supplierId] = {
        supplier: item.supplier!,
        items: []
      };
    }
    acc[supplierId].items.push(item);
    return acc;
  }, {} as Record<string, { supplier: any; items: any[] }>);

  const suppliers = Object.values(itemsBySupplier).map(group => group.supplier);
  
  // Calculate delivery information
  const supplierDeliveries = useMemo(() => 
    calculateSupplierDeliveries(suppliers), 
    [suppliers]
  );
  
  const consolidatedDeliveryWindow = useMemo(() => 
    calculateConsolidatedDeliveryWindow(supplierDeliveries),
    [supplierDeliveries]
  );

  const optimalDeliveryDay = useMemo(() => 
    findOptimalDeliveryDay(suppliers),
    [suppliers]
  );

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity);
  }, 0);

  const getSupplierSubtotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    // Simulate order processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const order: Order = {
      id: `order-${Date.now()}`,
      items: cart.items,
      totalCost: totalAmount,
      orderDate: new Date().toISOString(),
      deliveryWindow: {
        start: consolidatedDeliveryWindow.start.toISOString(),
        end: consolidatedDeliveryWindow.end.toISOString()
      },
      status: 'pending',
      supplierBreakdown: Object.values(itemsBySupplier).map(({ supplier, items }) => ({
        supplierId: supplier.id,
        items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        subtotal: getSupplierSubtotal(items),
        deliveryDate: supplierDeliveries.find(d => d.supplierId === supplier.id)?.deliveryDate.toISOString() || new Date().toISOString()
      }))
    };

    placeOrder(order);
    router.push(`/confirmation?orderId=${order.id}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add items to your cart before checkout</p>
            <Link
              href="/"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and delivery information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Supplier Delivery Windows */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Schedule by Supplier
              </h2>
              
              <div className="space-y-4">
                {supplierDeliveries.map(delivery => {
                  const supplierGroup = itemsBySupplier[delivery.supplierId];
                  if (!supplierGroup) return null;

                  return (
                    <div key={delivery.supplierId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{delivery.supplierName}</h3>
                          <p className="text-sm text-gray-600">
                            {supplierGroup.items.length} item{supplierGroup.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${getSupplierSubtotal(supplierGroup.items).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-md p-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-blue-900">Expected Delivery</p>
                            <p className="text-sm text-blue-700">
                              {formatDeliveryWindow(delivery.deliveryWindow)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">
                          Regular delivery days: {supplierGroup.supplier.deliveryDays.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Order cutoff: {supplierGroup.supplier.cutoffTime}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optimal Delivery Day */}
            {optimalDeliveryDay && (
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-green-900 mb-1">Recommended Delivery Day</h3>
                    <p className="text-sm text-green-700 mb-2">
                      {optimalDeliveryDay.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs text-green-600">
                      Most of your suppliers can deliver on this day, minimizing delivery windows.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Consolidated Delivery Window
              </h2>
              
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-medium text-amber-900">Your Complete Order</h3>
                </div>
                <p className="text-lg font-semibold text-amber-900">
                  {formatDeliveryWindow(consolidatedDeliveryWindow)}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  All items will be delivered within this window
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {Object.values(itemsBySupplier).map(({ supplier, items }) => (
                  <div key={supplier.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{supplier.name}</span>
                      <span className="font-medium">${getSupplierSubtotal(items).toFixed(2)}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {items.map(item => (
                        <div key={item.productId} className="flex justify-between text-xs text-gray-600">
                          <span>{item.product.name} × {item.quantity}</span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors block text-center"
                >
                  ← Back to Cart
                </Link>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isPlacingOrder ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>This is a demo order. No payment will be processed.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
