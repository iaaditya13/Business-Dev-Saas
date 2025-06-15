import { useState, useRef, useEffect } from 'react';
import { useSupabaseBusinessStore } from '@/stores/supabaseBusinessStore';
import { contextAwareGeminiService, ChatMessage } from '@/services/contextAwareGeminiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Bot, User, Plus, MessageSquare, Edit3, Trash2 } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

interface AiAssistantProps {
  onClose: () => void;
}

export const AiAssistant = ({ onClose }: AiAssistantProps) => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Business Insights',
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your AI business assistant with access to your real-time business data. I can help you analyze your finances, sales, inventory, and provide strategic insights based on your actual business performance. What would you like to know?',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date()
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Fetch business data when component mounts
  const { fetchAllData } = useSupabaseBusinessStore();
  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentChat?.messages]);

  const generateChatTitle = (message: string): string => {
    // Remove common words and clean the message
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must', 'ought', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'how', 'when', 'where', 'why', 'who'];
    
    // Clean and split the message
    const words = message
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 4); // Take first 4 meaningful words

    if (words.length === 0) {
      return 'New Chat';
    }

    // Capitalize first letter of each word and join
    const title = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Limit title length
    return title.length > 30 ? title.slice(0, 27) + '...' : title;
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m ready to help you with insights about your business. What would you like to know?',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    if (chats.length === 1) return; // Don't delete the last chat
    
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats[0]?.id || '');
    }
  };

  const updateChatTitle = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
    setEditingChatId(null);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentChat) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    // Check if this is the first user message in the chat (excluding assistant's welcome message)
    const isFirstUserMessage = currentChat.messages.filter(msg => msg.role === 'user').length === 0;

    // Update current chat with user message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));

    // Generate meaningful title if it's the first user message and chat title is still "New Chat"
    if (isFirstUserMessage && currentChat.title === 'New Chat') {
      const newTitle = generateChatTitle(input.trim());
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, title: newTitle }
          : chat
      ));
    }

    setInput('');
    setIsLoading(true);

    try {
      const response = await contextAwareGeminiService.generateResponse(
        input.trim(),
        null, // Legacy parameter
        currentChat.messages
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please make sure your Gemini API key is configured correctly and try again.',
        timestamp: new Date().toISOString()
      };
      
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full max-h-[80vh]">
      {/* Chat History Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-3 border-b border-border">
          <Button 
            onClick={createNewChat}
            className="w-full justify-start"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`group relative flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                  currentChatId === chat.id ? 'bg-muted' : ''
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                
                {editingChatId === chat.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => updateChatTitle(chat.id, editTitle || chat.title)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateChatTitle(chat.id, editTitle || chat.title);
                      }
                    }}
                    className="h-6 text-xs"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm truncate flex-1">{chat.title}</span>
                )}
                
                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingChatId(chat.id);
                      setEditTitle(chat.title);
                    }}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  {chats.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-foreground">Context-Aware AI Assistant</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {currentChat?.messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg break-words ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your business data..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
