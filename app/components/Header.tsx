'use client';

import Link from 'next/link';
import { useCart } from '../providers/CartProvider';

export function Header() {
  const { cart, openCart } = useCart();
  
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              ☕ OneCart
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
              Catalog
            </Link>
            <Link href="/orders" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
              Orders
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden">
            <Link href="/orders" className="text-neutral-700 hover:text-primary-600 transition-colors text-sm font-medium">
              Orders
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={openCart}
              className="btn-primary relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8l2 8h14M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-2-8" />
              </svg>
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-error-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
