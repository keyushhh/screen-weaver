import { supabase } from './supabase';

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  apartment: string | null;
  landmark: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  latitude: number;
  longitude: number;
  plus_code: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  created_at?: string;
}

// Helper to map UI fields to DB fields
// UI uses: tag, house, area, landmark, city, state, plusCode, lat, lng, name, phone
// DB uses: label, apartment, area, landmark, city, state, plus_code, latitude, longitude, contact_name, contact_phone

export const fetchAddresses = async (userId: string) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Address[];
};

export const createAddress = async (address: Omit<Address, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('addresses')
    .insert(address)
    .select()
    .single();

  if (error) throw error;
  return data as Address;
};

export const updateAddress = async (id: string, updates: Partial<Address>) => {
  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Address;
};

export const deleteAddress = async (id: string) => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
