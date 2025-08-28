'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../providers/CartProvider';
import { mockProducts, mockSuppliers } from '../data/mockData';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCart();

  // Close cart when clicking outside
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const cartItems = cart.items.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    const supplier = product ? mockSuppliers.find(s => s.id === product.supplierId) : null;
    return { ...item, product, supplier };
  }).filter(item => item.product && item.supplier);

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          overflow: 'hidden'
        }}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🛒</div>
                <p className="text-gray-600">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.product!.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.supplier!.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${item.product!.price.toFixed(2)} per {item.product!.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-white rounded-full border border-neutral-200 overflow-hidden w-fit">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                        >
                          <div className="w-4 h-4 bg-neutral-100 rounded-full flex items-center justify-center">
                            <svg className="w-2 h-2 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </div>
                        </button>
                        <div className="px-3 py-1 min-w-[2rem] text-center">
                          <span className="text-sm font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                        </div>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                        >
                          <div className="w-4 h-4 bg-neutral-100 rounded-full flex items-center justify-center">
                            <svg className="w-2 h-2 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </button>
                      </div>
                      <span className="font-bold text-sm text-neutral-900">
                        ${(item.product!.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-900">Total:</span>
                <span className="font-bold text-xl text-neutral-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors block text-center"
                >
                  View Cart Details
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors block text-center"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
