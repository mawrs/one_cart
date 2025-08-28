'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import { useCart } from '../providers/CartProvider';
import { mockProducts, mockSuppliers } from '../data/mockData';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity);
  }, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = mockProducts.find(p => p.id === productId);
    
    if (product && newQuantity < product.minimumOrderQuantity) {
      setErrors(prev => ({
        ...prev,
        [productId]: `Minimum order quantity is ${product.minimumOrderQuantity} ${product.unit}`
      }));
      return;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[productId];
      return newErrors;
    });

    updateQuantity(productId, newQuantity);
  };

  const getSupplierSubtotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
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
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.values(itemsBySupplier).map(({ supplier, items }) => (
              <div key={supplier.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Supplier Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            {supplier.rating.toFixed(1)}
                          </span>
                        </div>
                        {supplier.verified && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Delivers: {supplier.deliveryDays.join(', ')} • Cutoff: {supplier.cutoffTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="font-semibold text-lg">
                        ${getSupplierSubtotal(items).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-200">
                  {items.map(item => (
                    <div key={item.productId} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">📦</span>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.product.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.product.price.toFixed(2)} per {item.product.unit}
                          </p>
                          <p className="text-xs text-gray-500">
                            MOQ: {item.product.minimumOrderQuantity} {item.product.unit}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={item.product.minimumOrderQuantity}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                              className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right min-w-[80px]">
                            <p className="font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {errors[item.productId] && (
                        <div className="mt-2 text-red-600 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors[item.productId]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {Object.values(itemsBySupplier).map(({ supplier, items }) => (
                  <div key={supplier.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{supplier.name}</span>
                    <span className="font-medium">${getSupplierSubtotal(items).toFixed(2)}</span>
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
                  href="/"
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors block text-center"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/checkout"
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors block text-center ${
                    Object.keys(errors).length > 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {Object.keys(errors).length > 0 ? 'Fix Errors to Continue' : 'Proceed to Checkout'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
