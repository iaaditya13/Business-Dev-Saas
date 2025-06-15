
import { useState } from 'react';
import { MessageList } from './MessageList';
import { ContactList } from './ContactList';
import { MessageInput } from './MessageInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    status: 'online'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    status: 'away',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@company.com',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@company.com',
    status: 'online'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: 'current-user',
    content: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: true,
    type: 'text'
  },
  {
    id: '2',
    senderId: 'current-user',
    receiverId: '1',
    content: 'I\'m doing great! Working on the new project.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    read: true,
    type: 'text'
  },
  {
    id: '3',
    senderId: '1',
    receiverId: 'current-user',
    content: 'That sounds exciting! Let me know if you need any help.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: true,
    type: 'text'
  }
];

export const Messaging = () => {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
  const [showContacts, setShowContacts] = useState(false);

  const handleSendMessage = (content: string) => {
    if (!selectedContact || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      receiverId: selectedContact.id,
      content: content.trim(),
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate a response after 2 seconds
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        receiverId: 'current-user',
        content: `Thanks for your message! I'll get back to you soon.`,
        timestamp: new Date(),
        read: false,
        type: 'text'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const getContactMessages = (contactId: string) => {
    return messages.filter(
      msg => 
        (msg.senderId === contactId && msg.receiverId === 'current-user') ||
        (msg.senderId === 'current-user' && msg.receiverId === contactId)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messaging</h1>
          <p className="text-muted-foreground">Internal team communication</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowContacts(!showContacts)}
          className="md:hidden"
        >
          <Users className="h-4 w-4 mr-2" />
          Contacts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
        {/* Contact List */}
        <div className={`md:col-span-1 ${showContacts ? 'block' : 'hidden md:block'}`}>
          <ContactList
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={(contact) => {
              setSelectedContact(contact);
              setShowContacts(false);
            }}
            getUnreadCount={(contactId) => 
              getContactMessages(contactId).filter(msg => 
                !msg.read && msg.senderId === contactId
              ).length
            }
          />
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedContact.status === 'online' ? 'bg-green-500' :
                      selectedContact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <div className="text-lg font-semibold">{selectedContact.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedContact.status === 'online' ? 'Online' :
                         selectedContact.status === 'away' ? 'Away' :
                         selectedContact.lastSeen ? 
                           `Last seen ${selectedContact.lastSeen.toLocaleTimeString()}` : 
                           'Offline'}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Messages */}
              <div className="flex-1 mb-4">
                <MessageList
                  messages={getContactMessages(selectedContact.id)}
                  currentUserId="current-user"
                  contact={selectedContact}
                />
              </div>

              {/* Message Input */}
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a contact from the list to start messaging
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
