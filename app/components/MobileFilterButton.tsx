'use client';

import Image from 'next/image';

interface MobileFilterButtonProps {
  onClick: () => void;
  activeFiltersCount?: number;
}

export function MobileFilterButton({ onClick, activeFiltersCount = 0 }: MobileFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
    >
      <div className="relative">
        <Image
          src="/filter.svg"
          alt="Filters"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {activeFiltersCount}
          </span>
        )}
      </div>
    </button>
  );
}
