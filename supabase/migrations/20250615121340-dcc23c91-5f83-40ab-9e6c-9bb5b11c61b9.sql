
-- Create a table for AI chat sessions
CREATE TABLE public.ai_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own chats
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own chats
CREATE POLICY "Users can view their own ai_chats" 
  ON public.ai_chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own chats
CREATE POLICY "Users can create their own ai_chats" 
  ON public.ai_chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own chats
CREATE POLICY "Users can update their own ai_chats" 
  ON public.ai_chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own chats
CREATE POLICY "Users can delete their own ai_chats" 
  ON public.ai_chats 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_ai_chats_updated_at 
  BEFORE UPDATE ON public.ai_chats 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
