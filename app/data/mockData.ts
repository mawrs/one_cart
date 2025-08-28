import { Supplier, Product } from '../types';

// Generate 100 mock suppliers
export const mockSuppliers: Supplier[] = [
  // Coffee Roasters
  { id: 'sup-001', name: 'Blue Mountain Coffee Co.', verified: true, rating: 4.8, deliveryDays: ['monday', 'wednesday', 'friday'], cutoffTime: '2:00 PM', description: 'Premium single-origin coffee beans' },
  { id: 'sup-002', name: 'Artisan Roasters', verified: true, rating: 4.6, deliveryDays: ['tuesday', 'thursday'], cutoffTime: '12:00 PM', description: 'Small batch specialty coffee' },
  { id: 'sup-003', name: 'Colombian Gold', verified: false, rating: 4.2, deliveryDays: ['monday', 'wednesday'], cutoffTime: '3:00 PM', description: 'Direct trade Colombian beans' },
  { id: 'sup-004', name: 'Ethiopian Highlands', verified: true, rating: 4.9, deliveryDays: ['tuesday', 'friday'], cutoffTime: '1:00 PM', description: 'Authentic Ethiopian coffee' },
  { id: 'sup-005', name: 'Pacific Coast Roastery', verified: true, rating: 4.5, deliveryDays: ['daily'], cutoffTime: '4:00 PM', description: 'West coast coffee roasters' },
  
  // Dairy Suppliers
  { id: 'sup-006', name: 'Farm Fresh Dairy', verified: true, rating: 4.7, deliveryDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], cutoffTime: '6:00 AM', description: 'Local organic dairy products' },
  { id: 'sup-007', name: 'Oat Dreams Co.', verified: true, rating: 4.4, deliveryDays: ['tuesday', 'thursday'], cutoffTime: '10:00 AM', description: 'Plant-based milk alternatives' },
  { id: 'sup-008', name: 'Creamery Delights', verified: false, rating: 4.1, deliveryDays: ['monday', 'wednesday', 'friday'], cutoffTime: '8:00 AM', description: 'Traditional dairy supplier' },
  { id: 'sup-009', name: 'Sustainable Soy', verified: true, rating: 4.6, deliveryDays: ['wednesday', 'friday'], cutoffTime: '11:00 AM', description: 'Eco-friendly soy products' },
  { id: 'sup-010', name: 'Almond Valley', verified: true, rating: 4.3, deliveryDays: ['tuesday', 'saturday'], cutoffTime: '2:00 PM', description: 'Premium almond milk' },
  
  // Bakery Suppliers
  { id: 'sup-011', name: 'Morning Glory Bakery', verified: true, rating: 4.8, deliveryDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], cutoffTime: '5:00 AM', description: 'Fresh daily pastries' },
  { id: 'sup-012', name: 'Artisan Breads', verified: true, rating: 4.5, deliveryDays: ['tuesday', 'thursday', 'saturday'], cutoffTime: '7:00 AM', description: 'Handcrafted breads and pastries' },
  { id: 'sup-013', name: 'Sweet Treats Co.', verified: false, rating: 4.0, deliveryDays: ['monday', 'wednesday'], cutoffTime: '9:00 AM', description: 'Specialty desserts and muffins' },
  { id: 'sup-014', name: 'Gluten-Free Delights', verified: true, rating: 4.7, deliveryDays: ['tuesday', 'friday'], cutoffTime: '6:00 AM', description: 'Gluten-free baked goods' },
  { id: 'sup-015', name: 'Croissant Masters', verified: true, rating: 4.9, deliveryDays: ['monday', 'wednesday', 'friday'], cutoffTime: '4:00 AM', description: 'French pastries and croissants' },
  
  // Disposables Suppliers
  { id: 'sup-016', name: 'EcoCup Solutions', verified: true, rating: 4.6, deliveryDays: ['monday', 'thursday'], cutoffTime: '3:00 PM', description: 'Sustainable disposable cups' },
  { id: 'sup-017', name: 'Packaging Pro', verified: true, rating: 4.4, deliveryDays: ['tuesday', 'friday'], cutoffTime: '1:00 PM', description: 'Complete packaging solutions' },
  { id: 'sup-018', name: 'Green Disposables', verified: false, rating: 4.2, deliveryDays: ['wednesday', 'saturday'], cutoffTime: '2:00 PM', description: 'Biodegradable cups and lids' },
  { id: 'sup-019', name: 'Cup & Lid Express', verified: true, rating: 4.3, deliveryDays: ['monday', 'tuesday', 'wednesday'], cutoffTime: '12:00 PM', description: 'Fast delivery disposables' },
  { id: 'sup-020', name: 'Sustainable Supplies', verified: true, rating: 4.8, deliveryDays: ['thursday', 'friday'], cutoffTime: '4:00 PM', description: 'Eco-friendly packaging' },

  // Additional suppliers to reach 100
  ...Array.from({ length: 80 }, (_, i) => ({
    id: `sup-${String(i + 21).padStart(3, '0')}`,
    name: generateSupplierName(),
    verified: Math.random() > 0.3,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    deliveryDays: generateDeliveryDays(),
    cutoffTime: generateCutoffTime(),
    description: generateSupplierDescription()
  }))
];

// Generate 30 products
export const mockProducts: Product[] = [
  // Coffee Beans
  { id: 'prod-001', name: 'Ethiopian Yirgacheffe', description: 'Bright, floral single-origin beans', price: 18.50, minimumOrderQuantity: 2, unit: 'lbs', category: 'beans', supplierId: 'sup-004', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-002', name: 'Colombian Supremo', description: 'Full-bodied medium roast', price: 16.75, minimumOrderQuantity: 5, unit: 'lbs', category: 'beans', supplierId: 'sup-003', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-003', name: 'Blue Mountain Reserve', description: 'Premium Jamaican coffee beans', price: 45.00, minimumOrderQuantity: 1, unit: 'lbs', category: 'beans', supplierId: 'sup-001', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-004', name: 'House Blend Dark Roast', description: 'Rich, bold everyday blend', price: 14.25, minimumOrderQuantity: 10, unit: 'lbs', category: 'beans', supplierId: 'sup-002', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-005', name: 'Decaf French Roast', description: 'Smooth decaffeinated dark roast', price: 15.50, minimumOrderQuantity: 3, unit: 'lbs', category: 'beans', supplierId: 'sup-005', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-006', name: 'Espresso Blend', description: 'Perfect for espresso shots', price: 17.25, minimumOrderQuantity: 4, unit: 'lbs', category: 'beans', supplierId: 'sup-001', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-007', name: 'Single Origin Guatemala', description: 'Chocolatey notes with bright acidity', price: 19.00, minimumOrderQuantity: 2, unit: 'lbs', category: 'beans', supplierId: 'sup-002', imageUrl: '/api/placeholder/300/300', inStock: true },
  
  // Dairy Products
  { id: 'prod-008', name: 'Whole Milk', description: 'Fresh local whole milk', price: 3.25, minimumOrderQuantity: 12, unit: 'gallons', category: 'dairy', supplierId: 'sup-006', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-009', name: 'Oat Milk', description: 'Creamy plant-based alternative', price: 4.50, minimumOrderQuantity: 6, unit: 'half-gallons', category: 'dairy', supplierId: 'sup-007', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-010', name: 'Heavy Cream', description: 'Rich cream for specialty drinks', price: 5.75, minimumOrderQuantity: 8, unit: 'quarts', category: 'dairy', supplierId: 'sup-006', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-011', name: 'Almond Milk', description: 'Unsweetened almond milk', price: 4.25, minimumOrderQuantity: 6, unit: 'half-gallons', category: 'dairy', supplierId: 'sup-010', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-012', name: 'Soy Milk Original', description: 'Traditional soy milk', price: 3.95, minimumOrderQuantity: 8, unit: 'half-gallons', category: 'dairy', supplierId: 'sup-009', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-013', name: 'Half & Half', description: 'Perfect for coffee service', price: 4.15, minimumOrderQuantity: 10, unit: 'quarts', category: 'dairy', supplierId: 'sup-008', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-014', name: 'Coconut Milk', description: 'Rich coconut alternative', price: 4.75, minimumOrderQuantity: 4, unit: 'half-gallons', category: 'dairy', supplierId: 'sup-007', imageUrl: '/api/placeholder/300/300', inStock: true },
  
  // Bakery Items
  { id: 'prod-015', name: 'Croissants', description: 'Buttery French pastries', price: 24.00, minimumOrderQuantity: 2, unit: 'dozens', category: 'bakery', supplierId: 'sup-015', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-016', name: 'Blueberry Muffins', description: 'Fresh baked muffins', price: 18.50, minimumOrderQuantity: 3, unit: 'dozens', category: 'bakery', supplierId: 'sup-011', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-017', name: 'Banana Bread', description: 'Moist homestyle banana bread', price: 12.75, minimumOrderQuantity: 4, unit: 'loaves', category: 'bakery', supplierId: 'sup-012', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-018', name: 'Scones Assorted', description: 'Mixed berry and plain scones', price: 22.00, minimumOrderQuantity: 2, unit: 'dozens', category: 'bakery', supplierId: 'sup-013', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-019', name: 'Gluten-Free Muffins', description: 'Delicious gluten-free options', price: 26.50, minimumOrderQuantity: 2, unit: 'dozens', category: 'bakery', supplierId: 'sup-014', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-020', name: 'Danish Pastries', description: 'Assorted Danish pastries', price: 28.00, minimumOrderQuantity: 1, unit: 'dozens', category: 'bakery', supplierId: 'sup-015', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-021', name: 'Bagels Assorted', description: 'Fresh bagels, mixed varieties', price: 15.00, minimumOrderQuantity: 3, unit: 'dozens', category: 'bakery', supplierId: 'sup-011', imageUrl: '/api/placeholder/300/300', inStock: true },
  
  // Disposables
  { id: 'prod-022', name: '12oz Coffee Cups', description: 'Disposable hot cups with lids', price: 45.00, minimumOrderQuantity: 5, unit: 'cases (1000)', category: 'disposables', supplierId: 'sup-016', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-023', name: '16oz Coffee Cups', description: 'Large disposable hot cups', price: 52.00, minimumOrderQuantity: 3, unit: 'cases (1000)', category: 'disposables', supplierId: 'sup-017', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-024', name: 'Compostable Lids', description: 'Eco-friendly cup lids', price: 28.50, minimumOrderQuantity: 8, unit: 'cases (1000)', category: 'disposables', supplierId: 'sup-018', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-025', name: 'Paper Napkins', description: 'Single-ply napkins', price: 35.75, minimumOrderQuantity: 6, unit: 'cases (5000)', category: 'disposables', supplierId: 'sup-019', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-026', name: 'Wooden Stirrers', description: 'Eco-friendly coffee stirrers', price: 22.00, minimumOrderQuantity: 10, unit: 'cases (10000)', category: 'disposables', supplierId: 'sup-020', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-027', name: 'Take-out Bags', description: 'Branded paper bags', price: 18.25, minimumOrderQuantity: 5, unit: 'cases (500)', category: 'disposables', supplierId: 'sup-016', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-028', name: 'Cold Cup Lids', description: 'Clear lids for cold beverages', price: 31.50, minimumOrderQuantity: 4, unit: 'cases (1000)', category: 'disposables', supplierId: 'sup-017', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-029', name: 'Sleeve Holders', description: 'Insulated cup sleeves', price: 26.75, minimumOrderQuantity: 7, unit: 'cases (1000)', category: 'disposables', supplierId: 'sup-018', imageUrl: '/api/placeholder/300/300', inStock: true },
  { id: 'prod-030', name: 'Food Service Gloves', description: 'Disposable food handling gloves', price: 42.00, minimumOrderQuantity: 2, unit: 'cases (1000)', category: 'disposables', supplierId: 'sup-019', imageUrl: '/api/placeholder/300/300', inStock: true }
];

function generateSupplierName(): string {
  const prefixes = ['Premium', 'Fresh', 'Quality', 'Golden', 'Superior', 'Elite', 'Prime', 'Select', 'Artisan', 'Gourmet'];
  const suffixes = ['Supply Co.', 'Distributors', 'Solutions', 'Express', 'Direct', 'Wholesale', 'Partners', 'Trading', 'Imports', 'Group'];
  const middle = ['Coffee', 'Food', 'Dairy', 'Bakery', 'Cup', 'Pack', 'Bean', 'Mill', 'Farm', 'House'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${middle[Math.floor(Math.random() * middle.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generateDeliveryDays(): string[] {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const numDays = Math.floor(Math.random() * 4) + 1; // 1-4 days
  const selectedDays = [];
  
  for (let i = 0; i < numDays; i++) {
    const randomDay = days[Math.floor(Math.random() * days.length)];
    if (!selectedDays.includes(randomDay)) {
      selectedDays.push(randomDay);
    }
  }
  
  return selectedDays.sort((a, b) => days.indexOf(a) - days.indexOf(b));
}

function generateCutoffTime(): string {
  const hours = [8, 9, 10, 11, 12, 1, 2, 3, 4];
  const periods = ['AM', 'PM'];
  const hour = hours[Math.floor(Math.random() * hours.length)];
  const period = periods[Math.floor(Math.random() * periods.length)];
  
  return `${hour}:00 ${period}`;
}

function generateSupplierDescription(): string {
  const descriptions = [
    'Reliable wholesale supplier',
    'Premium quality products',
    'Fast delivery service',
    'Competitive pricing',
    'Locally sourced goods',
    'Sustainable products',
    'Family-owned business',
    'Industry leader',
    'Specialty supplier',
    'Trusted partner'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}
