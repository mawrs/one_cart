'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../providers/CartProvider';

export function TopNavigation() {
  const { cart, openCart } = useCart();
  
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.svg"
                alt="OneCart"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-display text-2xl font-bold text-neutral-900">
                OneCart
              </span>
            </Link>
          </div>
          
          {/* Right side - Cart and Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/orders" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
              Orders
            </Link>
            
            <button
              onClick={openCart}
              className="flex items-center space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors group"
            >
              <div className="relative">
                <svg className="w-6 h-6 text-neutral-700 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8l2 8h14M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-2-8" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm text-neutral-600 font-medium">
                  Shopping cart:
                </div>
                <div className="text-lg font-bold text-neutral-900">
                  ${subtotal.toFixed(2)}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
