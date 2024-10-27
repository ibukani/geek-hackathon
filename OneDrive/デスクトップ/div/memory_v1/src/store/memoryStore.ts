import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Memory {
  id: string;
  recipient: string;
  message: string;
  date: string;
  image_url?: string;
  user_id: string;
  created_at: string;
}

interface MemoryState {
  memories: Memory[];
  loading: boolean;
  fetchMemories: () => Promise<void>;
  createMemory: (memory: Omit<Memory, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  updateMemory: (id: string, updates: Partial<Memory>) => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  loading: false,
  fetchMemories: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    set({ memories: data || [], loading: false });
  },
  createMemory: async (memory) => {
    const { data, error } = await supabase
      .from('memories')
      .insert([memory])
      .select()
      .single();
    
    if (error) throw error;
    set({ memories: [data, ...get().memories] });
  },
  deleteMemory: async (id) => {
    const { error } = await supabase
      .from('memories')
      .delete()
      .match({ id });
    
    if (error) throw error;
    set({ memories: get().memories.filter(m => m.id !== id) });
  },
  updateMemory: async (id, updates) => {
    const { data, error } = await supabase
      .from('memories')
      .update(updates)
      .match({ id })
      .select()
      .single();
    
    if (error) throw error;
    set({
      memories: get().memories.map(m => 
        m.id === id ? { ...m, ...data } : m
      ),
    });
  },
}));