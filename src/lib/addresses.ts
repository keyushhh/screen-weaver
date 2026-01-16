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
  // Debug: Check session state inside the library function
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log("createAddress - Lib Auth User:", user?.id, "Error:", authError);
  console.log("createAddress - Payload:", address);

  if (!user) {
    console.error("createAddress - No authenticated user found in lib client!");
  } else if (user.id !== address.user_id) {
    console.error("createAddress - User ID Mismatch! Session:", user.id, "Payload:", address.user_id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert(address)
    .select()
    .single();

  if (error) {
    console.error("createAddress - Insert Error:", error);
    throw error;
  }
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
