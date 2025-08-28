'use client';

import Link from 'next/link';
import { useCart } from '../providers/CartProvider';
import { CategoryFilter, SortOption } from '../types';

interface SidebarProps {
  categoryFilter: CategoryFilter;
  setCategoryFilter: (filter: CategoryFilter) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

export function Sidebar({
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption,
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange
}: SidebarProps) {
  const categories = [
    { value: 'all' as CategoryFilter, label: 'All Categories', icon: '🛍️', count: 30 },
    { value: 'beans' as CategoryFilter, label: 'Beans', icon: '☕', count: 7 },
    { value: 'dairy' as CategoryFilter, label: 'Dairy', icon: '🥛', count: 7 },
    { value: 'bakery' as CategoryFilter, label: 'Bakery', icon: '🥐', count: 7 },
    { value: 'disposables' as CategoryFilter, label: 'Disposables', icon: '🥤', count: 9 },
  ];

  return (
    <div className="w-80 bg-white border-r border-neutral-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Filter Header */}
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
        </h2>
      </div>

      {/* Search */}
      <div className="p-6 border-b border-neutral-200">
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
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setCategoryFilter(category.value)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                categoryFilter === category.value
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </div>
              <span className="text-xs text-neutral-500">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Price</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-600 mb-2">
              Max Price: ${priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--primary-500) 0%, var(--primary-500) ${priceRange[1]}%, var(--neutral-200) ${priceRange[1]}%, var(--neutral-200) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>$0</span>
              <span>$100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Sort By</h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="input"
        >
          <option value="name">Name A-Z</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Supplier Rating</option>
        </select>
      </div>


    </div>
  );
}
