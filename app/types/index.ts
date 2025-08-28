export interface Supplier {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  deliveryDays: string[]; // e.g., ['monday', 'wednesday', 'friday']
  cutoffTime: string; // e.g., "2:00 PM"
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  minimumOrderQuantity: number;
  unit: string; // e.g., "lbs", "cases", "units"
  category: 'beans' | 'dairy' | 'bakery' | 'disposables';
  supplierId: string;
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface Order {
  id: string;
  items: CartItem[];
  totalCost: number;
  orderDate: string;
  deliveryWindow: {
    start: string;
    end: string;
  };
  status: 'pending' | 'confirmed' | 'delivered';
  supplierBreakdown: {
    supplierId: string;
    items: CartItem[];
    subtotal: number;
    deliveryDate: string;
  }[];
}

export interface QualityIssue {
  orderId: string;
  issueType: 'missing' | 'damaged' | 'wrong';
  description: string;
  reportDate: string;
}

export type CategoryFilter = 'all' | 'beans' | 'dairy' | 'bakery' | 'disposables';
export type SortOption = 'name' | 'price-low' | 'price-high' | 'rating';
