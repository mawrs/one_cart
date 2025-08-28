'use client';

export function HeroBanner() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url('/hero_background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-left max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Wholesale Catalog
          </h1>
          <p className="text-xl md:text-2xl text-white text-opacity-90 leading-relaxed">
            Source everything your coffee shop needs from multiple suppliers in one place
          </p>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-6 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C600,0 600,120 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  );
}
