'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../providers/CartProvider';
import { mockProducts } from '../data/mockData';

export function TopNavigation() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cart, openCart } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);
  
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => {
    const product = mockProducts.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="font-display text-2xl font-bold text-neutral-900 hidden sm:inline">
                OneCart
              </span>
            </Link>
          </div>
          
          {/* Right side - User Dropdown and Cart */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 transition-colors font-medium py-2 px-3 rounded-lg group"
              >
                <Image
                  src="/user-profile.svg"
                  alt="User Profile"
                  width={32}
                  height={32}
                  className="w-6 h-6"
                />
                <span className="group-hover:underline hidden sm:inline">John Doe</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Previous Orders</span>
                    </div>
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </div>
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Log Out</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            {/* Shopping Cart */}
            <div className="relative">
              <button
                onClick={openCart}
                className="flex items-center space-x-3 p-3 rounded-lg transition-colors group relative"
              >
                <Image
                  src="/shopping-cart.svg"
                  alt="Shopping Cart"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="text-left">
                  <div className="text-sm text-neutral-600 font-medium group-hover:underline hidden sm:block">
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
      </div>
    </nav>
  );
}
