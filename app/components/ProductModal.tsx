'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '../types';
import { useCart } from '../providers/CartProvider';
import { mockSuppliers } from '../data/mockData';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const { addToCart } = useCart();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const supplier = mockSuppliers.find(s => s.id === product.supplierId);
  if (!supplier) return null;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= product.minimumOrderQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    onClose();
  };

  // Mock additional product images for the gallery
  const productImages = [
    '/placeholder.png',
    '/placeholder.png',
    '/placeholder.png',
    '/placeholder.png'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        overflow: 'hidden'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-5xl w-full h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Images & Supplier Info */}
              <div className="space-y-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                    <Image
                      src={productImages[selectedImageIndex]}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-4 gap-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square bg-neutral-100 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-primary-500' : 'border-transparent hover:border-neutral-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Supplier Info with Reviews Accordion */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Supplier Information</h3>
                  <div className="flex items-center gap-3 mb-4">
                    {/* Logo placeholder */}
                    <div className="w-12 h-12 bg-white rounded-full border-2 border-neutral-200 flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {supplier.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    {/* Supplier details */}
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
                          (455 reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Toggle Button */}
                  <button
                    onClick={() => setShowReviews(!showReviews)}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-neutral-900">Customer Reviews</span>
                    <svg 
                      className={`w-4 h-4 text-neutral-600 transition-transform ${showReviews ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expandable Reviews */}
                  {showReviews && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                      {/* Review 1 */}
                      <div className="p-3 bg-white rounded-lg border border-neutral-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">M</span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-900">Mike S. from Coffee Co.</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-xs">★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-700">
                          &quot;Excellent quality cups! Perfect for our coffee shop. They&apos;re sturdy, look professional, and our customers love them.&quot;
                        </p>
                      </div>

                      {/* Review 2 */}
                      <div className="p-3 bg-white rounded-lg border border-neutral-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">S</span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-900">Sarah L. from Bean There Cafe</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(4)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-xs">★</span>
                            ))}
                            <span className="text-neutral-300 text-xs">★</span>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-700">
                          "Good quality overall. Fast delivery and packaging was excellent. Only minor issue was some slight size variation."
                        </p>
                      </div>

                      {/* Review 3 */}
                      <div className="p-3 bg-white rounded-lg border border-neutral-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">D</span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-900">David R. from Morning Brew</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-xs">★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-700">
                          "Outstanding product! We've been ordering these for 6 months now. Consistent quality and reliable delivery."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Product Details */}
              <div className="space-y-6">
                {/* Category Badge */}
                <span className={`inline-block badge ${
                  product.category === 'beans' ? 'badge-secondary' :
                  product.category === 'dairy' ? 'badge-primary' :
                  product.category === 'bakery' ? 'badge-warning' :
                  'badge-success'
                } text-sm font-medium capitalize`}>
                  {product.category}
                </span>

                {/* Product Title */}
                <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>

                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">${product.price.toFixed(2)}</div>
                    <div className="text-sm text-neutral-600">
                      {product.quantityPerCase} per case • MOQ: {product.minimumOrderQuantity}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
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

                {/* Product Description */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Description</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {product.description || `High-quality ${product.name.toLowerCase()} perfect for your coffee shop needs. Sourced from trusted suppliers with consistent quality and reliable delivery.`}
                  </p>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Quantity (Min: {product.minimumOrderQuantity})
                    </label>
                    <div className="flex items-center bg-white rounded-full border border-neutral-200 overflow-hidden w-fit">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= product.minimumOrderQuantity}
                        className="w-12 h-12 flex items-center justify-center hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <div className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </div>
                      </button>
                      <div className="px-6 py-3 min-w-[4rem] text-center">
                        <span className="text-lg font-semibold text-neutral-900">
                          {quantity}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                      >
                        <div className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="btn-primary w-full h-12 flex items-center justify-center gap-2 text-base font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8l2 8h14M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-2-8" />
                    </svg>
                    Add to Cart
                  </button>
                </div>

                {/* Additional Details */}
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Category:</span>
                      <span className="text-neutral-900 capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Quantity per case:</span>
                      <span className="text-neutral-900">{product.quantityPerCase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Minimum order:</span>
                      <span className="text-neutral-900">{product.minimumOrderQuantity} cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Supplier:</span>
                      <span className="text-neutral-900">{supplier.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
