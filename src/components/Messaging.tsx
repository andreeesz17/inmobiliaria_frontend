import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Smile, MoreVertical, Reply, Forward, Trash2, Check, CheckCheck } from "lucide-react";
import { Button } from "./Button";
import { Card, CardHeader, CardTitle } from "./Card";
import { cn } from "../utils/cn";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
  replyTo?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface ChatProps {
  messages: Message[];
  currentUser: { id: string; name: string; avatar?: string };
  onSendMessage: (content: string, attachments?: File[]) => void;
  onMessageAction?: (messageId: string, action: 'reply' | 'forward' | 'delete') => void;
  isLoading?: boolean;
  className?: string;
}

export function Chat({
  messages,
  currentUser,
  onSendMessage,
  onMessageAction,
  isLoading = false,
  className
}: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Hoy";
    }
    
    if (messageDate.getDate() === today.getDate() - 1) {
      return "Ayer";
    }
    
    return messageDate.toLocaleDateString();
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender.id === currentUser.id;
          const showDate = index === 0 || 
            formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
          
          return (
            <div key={message.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={cn(
                "flex gap-2",
                isCurrentUser ? "justify-end" : "justify-start"
              )}>
                {!isCurrentUser && message.sender.avatar && (
                  <img 
                    src={message.sender.avatar} 
                    alt={message.sender.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                
                <div className={cn(
                  "max-w-xs lg:max-w-md xl:max-w-lg",
                  isCurrentUser ? "order-1" : "order-2"
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-2",
                    isCurrentUser 
                      ? "bg-primary text-primary-foreground rounded-br-md" 
                      : "bg-muted text-foreground rounded-bl-md"
                  )}>
                    {!isCurrentUser && (
                      <div className="text-xs font-medium mb-1 text-primary">
                        {message.sender.name}
                      </div>
                    )}
                    
                    <div className="text-sm">{message.content}</div>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map(attachment => (
                          <div 
                            key={attachment.id}
                            className="flex items-center gap-2 p-2 bg-black/10 rounded-lg"
                          >
                            <Paperclip className="h-4 w-4" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">
                                {attachment.name}
                              </div>
                              <div className="text-xs opacity-75">
                                {attachment.size}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-xs",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}>
                      <span>{formatTime(message.timestamp)}</span>
                      {isCurrentUser && getStatusIcon(message.status)}
                    </div>
                  </div>
                  
                  {onMessageAction && (
                    <div className={cn(
                      "flex gap-1 mt-1",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onMessageAction(message.id, 'reply')}
                        className="h-6 px-2 text-xs"
                      >
                        <Reply className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onMessageAction(message.id, 'forward')}
                        className="h-6 px-2 text-xs"
                      >
                        <Forward className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onMessageAction(message.id, 'delete')}
                        className="h-6 px-2 text-xs text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="border-t border-border p-3 bg-muted/50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 text-sm"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] max-h-32"
              rows={1}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() && attachments.length === 0}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Contact List Component
interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  activeContactId?: string;
  onSelectContact: (contactId: string) => void;
  className?: string;
}

export function ContactList({
  contacts,
  activeContactId,
  onSelectContact,
  className
}: ContactListProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {contacts.map(contact => (
        <button
          key={contact.id}
          onClick={() => onSelectContact(contact.id)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
            activeContactId === contact.id
              ? "bg-primary/10 text-primary border border-primary/20"
              : "hover:bg-muted"
          )}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {contact.avatar ? (
                <img 
                  src={contact.avatar} 
                  alt={contact.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-medium">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">
              {contact.name}
            </div>
            {contact.lastMessage && (
              <div className="text-sm text-muted-foreground truncate">
                {contact.lastMessage}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {contact.lastMessageTime && (
              <div className="text-xs text-muted-foreground">
                {contact.lastMessageTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
            {contact.unreadCount && contact.unreadCount > 0 && (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
                {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// Messaging Container Component
interface MessagingContainerProps {
  contacts: Contact[];
  messages: Message[];
  currentUser: { id: string; name: string; avatar?: string };
  activeContactId?: string;
  onContactSelect: (contactId: string) => void;
  onSendMessage: (content: string, attachments?: File[]) => void;
  className?: string;
}

export function MessagingContainer({
  contacts,
  messages,
  currentUser,
  activeContactId,
  onContactSelect,
  onSendMessage,
  className
}: MessagingContainerProps) {
  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <div className={cn("flex h-full bg-background", className)}>
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <Card className="rounded-none border-0 border-b">
          <CardHeader className="pb-3">
            <CardTitle>Mensajes</CardTitle>
          </CardHeader>
        </Card>
        
        <div className="flex-1 overflow-y-auto p-3">
          <ContactList
            contacts={contacts}
            activeContactId={activeContactId}
            onSelectContact={onContactSelect}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <Card className="rounded-none border-0 border-b">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {activeContact.avatar ? (
                        <img 
                          src={activeContact.avatar} 
                          alt={activeContact.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-medium">
                          {activeContact.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {activeContact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div>
                    <CardTitle className="text-lg">{activeContact.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {activeContact.isOnline ? "En línea" : "Desconectado"}
                    </p>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
            
            {/* Chat Messages */}
            <Chat
              messages={messages}
              currentUser={currentUser}
              onSendMessage={onSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Selecciona un contacto
              </h3>
              <p className="text-muted-foreground">
                Elige un contacto para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}