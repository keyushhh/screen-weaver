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

export const dev_updateOrderStatus = async (orderId: string, status: 'success' | 'failed' | 'cancelled') => {
  // Only allow in development
  if (!import.meta.env.DEV) {
    console.warn("dev_updateOrderStatus called in non-dev environment");
    return;
  }

  let metadata = {};

  if (status === 'failed') {
    metadata = { failure_reason: "Simulated dev failure" };
  } else if (status === 'cancelled') {
    metadata = {
      cancelled_by: "dev",
      cancel_reason_type: "Simulated dev cancellation",
      cancelled_at: new Date().toISOString()
    };
  }

  const { error } = await supabase
    .from('orders')
    .update({
      status: status,
      metadata: metadata
    })
    .eq('id', orderId);

  if (error) throw error;
};

export const fetchActiveOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, addresses(*)')
    .eq('user_id', userId)
    .in('status', ['processing', 'out_for_delivery', 'arrived'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
};

export const fetchPastOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, addresses(*)')
    .eq('user_id', userId)
    .in('status', ['delivered', 'success', 'failed', 'cancelled'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
};
export const cancelOrder = async (orderId: string) => {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      metadata: {
        cancelled_at: new Date().toISOString(),
        cancelled_by: 'user'
      }
    })
    .eq('id', orderId);

  if (error) throw error;
};
