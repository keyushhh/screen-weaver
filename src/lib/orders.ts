import { supabase } from './supabase';
import { Address } from './addresses';

export interface Order {
  id: string;
  user_id: string;
  amount: number;
  status: string; // 'processing', 'out_for_delivery', 'delivered', 'cancelled'
  payment_mode: string; // 'wallet', 'cash', 'upi'
  address_id: string | null;
  created_at: string;
  updated_at?: string;
  // Join fields
  addresses?: Address;
}

export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'addresses'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};

export const fetchRecentOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, addresses(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data as Order[];
};

export const fetchActiveOrder = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, addresses(*)')
    .eq('user_id', userId)
    .eq('status', 'processing')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as Order | null;
};
