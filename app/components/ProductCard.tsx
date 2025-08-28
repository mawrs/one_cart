'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product, Supplier } from '../types';
import { useCart } from '../providers/CartProvider';

interface ProductCardProps {
  product: Product;
  supplier: Supplier;
}

export function ProductCard({ product, supplier }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(product.minimumOrderQuantity);
  const [error, setError] = useState('');

  const handleAddToCart = () => {
    if (quantity < product.minimumOrderQuantity) {
      setError(`Minimum order quantity is ${product.minimumOrderQuantity} ${product.unit}`);
      return;
    }
    
    setError('');
    addToCart(product.id, quantity);
    setQuantity(product.minimumOrderQuantity);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    if (value >= product.minimumOrderQuantity) {
      setError('');
    }
  };

  return (
    <div className="card hover-lift transition-all">
      <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center relative overflow-hidden">
        {/* Category badge on top left of image */}
        <span className={`absolute top-3 left-3 badge ${
          product.category === 'beans' ? 'badge-secondary' :
          product.category === 'dairy' ? 'badge-primary' :
          product.category === 'bakery' ? 'badge-warning' :
          'badge-success'
        } text-xs font-medium capitalize`}>
          {product.category}
        </span>
        
        <Image
          src="/placeholder.png"
          alt={product.name}
          width={200}
          height={150}
          className="object-cover w-full h-full"
        />
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium text-sm">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="card-body">
        <h3 className="font-semibold text-neutral-900 text-base leading-tight mb-2">{product.name}</h3>
        
        <p className="text-neutral-600 text-xs mb-3 line-clamp-2">{product.description}</p>
        
        {/* Price section - big and bold */}
        <div className="mb-3">
          <div className="text-2xl font-bold text-neutral-900 mb-1">
            ${product.price.toFixed(2)}
          </div>
          <p className="text-xs text-neutral-600">
            Per case ({product.unit}) • MOQ: {product.minimumOrderQuantity} cases
          </p>
        </div>
        
        {/* Supplier section with logo space and stacked info */}
        <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="w-12 h-12 bg-white rounded-full border-2 border-neutral-200 flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {supplier.name.charAt(0)}
                </span>
              </div>
            </div>
            
            {/* Supplier name and rating stacked */}
            <div className="flex-1">
              <div className="text-sm font-semibold text-neutral-900 mb-1">
                {supplier.name}
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-neutral-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm font-semibold text-neutral-900 ml-2">
                  {supplier.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-500 ml-1">
                  (455)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quantity and Add to Cart - side by side */}
        <div className="flex items-center gap-3">
          {/* Pill-shaped quantity selector */}
          <div className="flex items-center bg-white rounded-full border border-neutral-200 overflow-hidden">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= product.minimumOrderQuantity}
              className="w-10 h-10 flex items-center justify-center hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <div className="px-4 py-2 min-w-[3rem] text-center">
              <span className="text-lg font-semibold text-neutral-900">
                {quantity}
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || !!error}
            className={`flex-1 h-12 ${
              product.inStock && !error
                ? 'btn-primary text-white rounded-full font-semibold'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed py-3 px-6 rounded-full font-semibold text-sm'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Add to Cart
          </button>
        </div>
        
        {/* Error message below if any */}
        {error && (
          <div className="alert alert-error mt-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
