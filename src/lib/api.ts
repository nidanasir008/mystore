export const API = {
  products: '/api/products',
  orders: '/api/orders',
  reviews: '/api/reviews',
  admin: '/api/admin',
  upload: '/api/upload',
};

export async function apiGet(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export async function apiPost(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function apiPut(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function apiDelete(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  stock: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  customer_name: string;
  instagram_id: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number | null;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const CHAT_LINK = 'https://www.instagram.com/direct/t/17847316857514402/';
export const SHOP_LINK = 'https://www.instagram.com/ramiya.pk/';
