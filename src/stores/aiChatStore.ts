
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from './authStore';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AiChat {
  id: string;
  user_id: string;
  title: string;
  messages: AiChatMessage[];
  created_at: string;
  updated_at: string;
}

interface AiChatStore {
  chats: AiChat[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchChats: () => Promise<void>;
  createChat: (title: string, initialMessage?: AiChatMessage) => Promise<string>;
  updateChat: (id: string, updates: Partial<Pick<AiChat, 'title' | 'messages'>>) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
}

export const useAiChatStore = create<AiChatStore>((set, get) => ({
  chats: [],
  isLoading: false,
  error: null,

  fetchChats: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Convert the data to proper AiChat format
      const transformedChats: AiChat[] = (data || []).map(chat => ({
        ...chat,
        messages: Array.isArray(chat.messages) ? chat.messages as AiChatMessage[] : []
      }));

      set({
        chats: transformedChats,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching AI chats:', error);
      set({ error: 'Failed to fetch chats', isLoading: false });
    }
  },

  createChat: async (title: string, initialMessage?: AiChatMessage) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const messages = initialMessage ? [initialMessage] : [];
      
      const { data, error } = await supabase
        .from('ai_chats')
        .insert([{
          user_id: user.id,
          title,
          messages: messages as any // Cast to Json type for Supabase
        }])
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data to proper AiChat format
      const newChat: AiChat = {
        ...data,
        messages: Array.isArray(data.messages) ? data.messages as AiChatMessage[] : []
      };

      set(state => ({
        chats: [newChat, ...state.chats]
      }));

      return data.id;
    } catch (error) {
      console.error('Error creating AI chat:', error);
      set({ error: 'Failed to create chat' });
      throw error;
    }
  },

  updateChat: async (id: string, updates: Partial<Pick<AiChat, 'title' | 'messages'>>) => {
    try {
      // Cast messages to Json type for Supabase if present
      const supabaseUpdates = updates.messages 
        ? { ...updates, messages: updates.messages as any }
        : updates;

      const { data, error } = await supabase
        .from('ai_chats')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data to proper AiChat format
      const updatedChat: AiChat = {
        ...data,
        messages: Array.isArray(data.messages) ? data.messages as AiChatMessage[] : []
      };

      set(state => ({
        chats: state.chats.map(chat => 
          chat.id === id ? updatedChat : chat
        )
      }));
    } catch (error) {
      console.error('Error updating AI chat:', error);
      set({ error: 'Failed to update chat' });
      throw error;
    }
  },

  deleteChat: async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_chats')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        chats: state.chats.filter(chat => chat.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting AI chat:', error);
      set({ error: 'Failed to delete chat' });
      throw error;
    }
  }
}));
