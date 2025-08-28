'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CategoryFilter, SortOption } from '../types';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  selectedCategory: CategoryFilter;
  setSelectedCategory: (category: CategoryFilter) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
}

export function MobileFilterModal({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  maxPrice
}: MobileFilterModalProps) {
  if (!isOpen) return null;

  const categories: { value: CategoryFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All Categories', count: 30 },
    { value: 'beans', label: 'Beans', count: 7 },
    { value: 'dairy', label: 'Dairy', count: 7 },
    { value: 'bakery', label: 'Bakery', count: 7 },
    { value: 'disposables', label: 'Disposables', count: 9 }
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Supplier Rating' }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <Image
              src="/filter.svg"
              alt="Filter"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Products */}
          <div className="p-4 border-b border-neutral-200">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Image
                src="/magnifying-glass.svg"
                alt="Search"
                width={16}
                height={16}
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
              />
            </div>
          </div>

          {/* Sort by */}
          <div className="p-4 border-b border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Sort by</h3>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="input appearance-none pr-10"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Image
                src="/chevron-down.svg"
                alt="Dropdown"
                width={16}
                height={16}
                className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 border-b border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={selectedCategory === category.value}
                    onChange={() => setSelectedCategory(category.value)}
                    className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  />
                  <span className="flex-1 text-sm text-neutral-700">{category.label}</span>
                  <span className="text-xs text-neutral-500">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Price</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">
                  Max Price: ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span>$0</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setSearchTerm('');
                setSortOption('name');
                setSelectedCategory('all');
                setPriceRange([0, maxPrice]);
              }}
              className="flex-1 btn-outline-primary"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
