import { useState, useRef, useEffect } from 'react';
import { useSupabaseBusinessStore } from '@/stores/supabaseBusinessStore';
import { useAiChatStore, AiChatMessage } from '@/stores/aiChatStore';
import { useAuthStore } from '@/stores/authStore';
import { contextAwareGeminiService } from '@/services/contextAwareGeminiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Bot, User, Plus, MessageSquare, Edit3, Trash2, AlertCircle, Key, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface AiAssistantProps {
  onClose: () => void;
}

export const AiAssistant = ({ onClose }: AiAssistantProps) => {
  const { chats, fetchChats, createChat, updateChat, deleteChat } = useAiChatStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch business data when component mounts
  const { fetchAllData } = useSupabaseBusinessStore();
  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    fetchAllData();
    
    // Check if API key is available
    const checkApiKey = () => {
      const isAvailable = contextAwareGeminiService.isAvailable();
      setApiKeyMissing(!isAvailable);
    };
    
    checkApiKey();

    // Fetch chats if user is authenticated
    if (user) {
      fetchChats();
    }
  }, [fetchAllData, user, fetchChats]);

  // Set initial chat when chats are loaded
  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  useEffect(() => {
    // Scroll to bottom when messages change with a slight delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentChat?.messages]);

  const handleSetApiKey = () => {
    if (tempApiKey.trim()) {
      contextAwareGeminiService.setApiKey(tempApiKey.trim());
      setApiKeyMissing(false);
      setShowApiKeyInput(false);
      setTempApiKey('');
    }
  };

  const handleShowApiKeyInput = () => {
    setShowApiKeyInput(true);
    setTempApiKey('');
  };

  const generateChatTitle = (message: string): string => {
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must', 'ought', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'how', 'when', 'where', 'why', 'who'];
    
    const words = message
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 4);

    if (words.length === 0) {
      return 'New Chat';
    }

    const title = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return title.length > 30 ? title.slice(0, 27) + '...' : title;
  };

  const createNewChat = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a new chat.",
        variant: "destructive"
      });
      return;
    }

    try {
      const assistantMessage: AiChatMessage = {
        role: 'assistant',
        content: 'Hello! I\'m ready to help you with insights about your business. What would you like to know?',
        timestamp: new Date().toISOString()
      };

      const chatId = await createChat('New Chat', assistantMessage);
      setCurrentChatId(chatId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat.",
        variant: "destructive"
      });
    }
  };

  const deleteChatHandler = async (chatId: string) => {
    if (chats.length === 1) return;
    
    try {
      await deleteChat(chatId);
      if (currentChatId === chatId) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        setCurrentChatId(remainingChats[0]?.id || null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat.",
        variant: "destructive"
      });
    }
  };

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      await updateChat(chatId, { title: newTitle });
      setEditingChatId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update chat title.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !user) return;

    // Check API key availability before sending
    if (!contextAwareGeminiService.isAvailable()) {
      setApiKeyMissing(true);
      return;
    }

    // If no current chat, create one
    if (!currentChatId) {
      try {
        const title = generateChatTitle(input.trim());
        const chatId = await createChat(title);
        setCurrentChatId(chatId);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create chat.",
          variant: "destructive"
        });
        return;
      }
    }

    const userMessage: AiChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    const isFirstUserMessage = currentChat?.messages.filter(msg => msg.role === 'user').length === 0;

    try {
      // Update chat with user message
      const updatedMessages = [...(currentChat?.messages || []), userMessage];
      await updateChat(currentChatId!, { messages: updatedMessages });

      // Update title if it's the first user message and title is "New Chat"
      if (isFirstUserMessage && currentChat?.title === 'New Chat') {
        const newTitle = generateChatTitle(input.trim());
        await updateChat(currentChatId!, { title: newTitle });
      }

      setInput('');
      setIsLoading(true);

      // Generate AI response
      const response = await contextAwareGeminiService.generateResponse(
        input.trim(),
        null,
        updatedMessages
      );

      const assistantMessage: AiChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      // Update chat with assistant message
      const finalMessages = [...updatedMessages, assistantMessage];
      await updateChat(currentChatId!, { messages: finalMessages });

    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: AiChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please make sure your Gemini API key is configured correctly and try again.',
        timestamp: new Date().toISOString()
      };
      
      try {
        const errorMessages = [...(currentChat?.messages || []), userMessage, errorMessage];
        await updateChat(currentChatId!, { messages: errorMessages });
      } catch (updateError) {
        console.error('Error saving error message:', updateError);
      }
      
      setApiKeyMissing(true);
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

  if (!user) {
    return (
      <div className="flex h-full max-h-[80vh] items-center justify-center bg-white rounded-2xl">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-dark mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please log in to use the AI Assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-[85vh] bg-white rounded-2xl overflow-hidden">
      {/* Chat History Sidebar */}
      <div className="w-80 border-r border-border/50 bg-gray-50/50 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-dark">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Business Intelligence</p>
            </div>
          </div>
          
          <Button 
            onClick={createNewChat}
            className="w-full justify-start mb-3"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
          
          <Button 
            onClick={handleShowApiKeyInput}
            variant="outline"
            className="w-full justify-start border-border/50"
            size="sm"
          >
            <Key className="h-4 w-4 mr-2" />
            Configure API Key
          </Button>
        </div>
        
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-4 space-y-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={cn(
                  'group relative flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200',
                  currentChatId === chat.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-white hover:shadow-soft'
                )}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <MessageSquare className={cn(
                  'h-4 w-4 flex-shrink-0',
                  currentChatId === chat.id ? 'text-primary' : 'text-muted-foreground'
                )} />
                
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
                    className="h-8 text-sm border-primary/30"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm truncate flex-1 text-dark">{chat.title}</span>
                )}
                
                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-primary/10"
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
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatHandler(chat.id);
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
        <div className="flex items-center justify-between p-6 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-dark">Context-Aware AI</h3>
              <p className="text-sm text-muted-foreground">Business Intelligence Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {(apiKeyMissing || showApiKeyInput) && (
          <div className="p-6 space-y-4 border-b border-border/50 bg-warning/5">
            {apiKeyMissing && (
              <Alert className="border-warning/30 bg-warning/10">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground">
                  AI Assistant requires a Gemini API key to function. Please enter your API key below.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-3">
              <Input
                type="password"
                placeholder="Enter your Gemini API key (AIzaSy...)"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="flex-1 input-focus"
              />
              <Button onClick={handleSetApiKey} disabled={!tempApiKey.trim()}>
                Save Key
              </Button>
              {!apiKeyMissing && (
                <Button variant="outline" onClick={() => setShowApiKeyInput(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 min-h-0 custom-scrollbar" style={{ overflow: 'auto' }}>
          <div className="p-6 space-y-6">
            {currentChat?.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start space-x-4 animate-fade-in',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    'max-w-[75%] px-6 py-4 rounded-2xl break-words shadow-soft',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white border border-border/50 text-dark'
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    'text-xs mt-3 opacity-70',
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-secondary to-warning rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-4 animate-fade-in">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white border border-border/50 rounded-2xl px-6 py-4 shadow-soft">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border/50 flex-shrink-0 bg-gray-50/30">
          <div className="flex space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={apiKeyMissing ? "Please configure your API key first" : "Ask anything about your business..."}
              disabled={isLoading || apiKeyMissing}
              className="flex-1 input-focus border-border/50 bg-white"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim() || apiKeyMissing}
              className="shadow-brand"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
