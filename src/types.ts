export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Flower' | 'Pre-rolls' | 'Vapes' | 'Cigars' | 'Accessories' | 'Glass & Pipes' | 'Papers & Rolling';
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

export type TriangleCity = 'Raleigh' | 'Durham' | 'Chapel Hill' | 'Cary' | 'Apex';

export interface Shop {
  id: string;
  name: string;
  address: string;
  city: TriangleCity;
  rating: number;
  reviewsCount: number;
  deliveryTime: string; // e.g. "15-25 min"
  deliveryFee: number;
  minOrder: number;
  imageUrl: string;
  featured: boolean;
  products: Product[];
  coords: { x: number; y: number; label: string };
}

export interface CartItem {
  product: Product;
  shopId: string;
  shopName: string;
  quantity: number;
}

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'picked_up' | 'arriving_soon' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopCoords: { x: number; y: number };
  deliveryAddress: string;
  deliveryCity: TriangleCity;
  deliveryCoords: { x: number; y: number };
  customerName: string;
  customerPhone: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  tip: number;
  total: number;
  status: OrderStatus;
  driverId: string | null;
  driverName: string | null;
  driverPhone: string | null;
  driverVehicle: string | null;
  driverCoords: { x: number; y: number } | null;
  createdAt: string;
  estimatedDeliveryTime: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  phone: string;
  status: 'offline' | 'idle' | 'assigned' | 'delivering';
  currentOrderId: string | null;
  coords: { x: number; y: number };
}
