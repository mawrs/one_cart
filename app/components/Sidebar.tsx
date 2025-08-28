'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    { value: 'all' as CategoryFilter, label: 'All Categories', count: 30 },
    { value: 'beans' as CategoryFilter, label: 'Beans', count: 7 },
    { value: 'dairy' as CategoryFilter, label: 'Dairy', count: 7 },
    { value: 'bakery' as CategoryFilter, label: 'Bakery', count: 7 },
    { value: 'disposables' as CategoryFilter, label: 'Disposables', count: 9 },
  ];

  return (
    <div className="w-80 bg-white border-r border-neutral-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Filter Header */}
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Image
            src="/filter.svg"
            alt="Filter"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          Filters
        </h2>
      </div>

      {/* Search Products */}
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
          {/* <Image
            src="/magnifying-glass.svg"
            alt="Search"
            width={16}
            height={16}
            className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
          /> */}
        </div>
      </div>

      {/* Sort by */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4 tracking-wide">Sort by</h3>
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="input appearance-none pr-10"
          >
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Supplier Rating</option>
          </select>
          <Image
            src="/chevron-down.svg"
            alt="Dropdown"
            width={16}
            height={16}
            className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4 tracking-wide">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label
              key={category.value}
              className="w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={categoryFilter === category.value}
                  onChange={() => setCategoryFilter(category.value)}
                  className="w-4 h-4 text-primary-600 bg-white border-neutral-300 focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-sm text-neutral-700">{category.label}</span>
              </div>
              <span className="text-xs text-neutral-500">({category.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4 tracking-wide">Price</h3>
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


    </div>
  );
}
