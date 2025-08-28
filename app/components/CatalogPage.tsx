'use client';

import { useState, useMemo } from 'react';
import { TopNavigation } from './TopNavigation';
import { HeroBanner } from './HeroBanner';
import { Sidebar } from './Sidebar';
import { ProductCard } from './ProductCard';
import { mockProducts, mockSuppliers } from '../data/mockData';
import { CategoryFilter, SortOption } from '../types';

export function CatalogPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          const supplierA = mockSuppliers.find(s => s.id === a.supplierId);
          const supplierB = mockSuppliers.find(s => s.id === b.supplierId);
          return (supplierB?.rating || 0) - (supplierA?.rating || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [categoryFilter, sortOption, searchTerm, priceRange]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Browse Products
                </h2>
                <p className="text-neutral-600">
                  {filteredAndSortedProducts.length} products available
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
                  <span>{mockSuppliers.length} Suppliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-secondary-500 rounded-full"></span>
                  <span>4 Categories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="product-grid">
            {filteredAndSortedProducts.map(product => {
              const supplier = mockSuppliers.find(s => s.id === product.supplierId);
              if (!supplier) return null;
              
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  supplier={supplier}
                />
              );
            })}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-neutral-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-neutral-900 mb-2">No products found</h3>
              <p className="text-neutral-600">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setSearchTerm('');
                  setPriceRange([0, 100]);
                }}
                className="btn-outline-primary mt-4"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
