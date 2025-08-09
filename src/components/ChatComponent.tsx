import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Search,
  User,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';
import { ChatRoom, ChatMessage, UserProfile } from '@/types/freelancing';
import { chatService, userService } from '@/services/freelancingService';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface ChatComponentProps {
  projectId?: string;
  clientId?: string;
  freelancerId?: string;
}

const ChatComponent = ({ projectId, clientId, freelancerId }: ChatComponentProps) => {
  const { currentUser } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userProfiles, setUserProfiles] = useState<{[key: string]: UserProfile}>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUserProfile = useCallback(async (userId: string) => {
    if (userProfiles[userId]) return userProfiles[userId];
    
    try {
      const profile = await userService.getUserProfile(userId);
      if (profile) {
        setUserProfiles(prev => ({ ...prev, [userId]: profile }));
        return profile;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
    return null;
  }, [userProfiles]);

  const loadChatRooms = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const rooms = await chatService.getUserChatRooms(currentUser.uid);
      setChatRooms(rooms);
      
      // Load user profiles for chat participants
      for (const room of rooms) {
        await loadUserProfile(room.clientId);
        await loadUserProfile(room.freelancerId);
      }
      
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, loadUserProfile]);

  const loadMessages = useCallback(async (chatId: string) => {
    try {
      // Subscribe to real-time messages
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      
      const unsubscribe = chatService.subscribeToChatMessages(chatId, (newMessages) => {
        setMessages(newMessages);
        setTimeout(scrollToBottom, 100);
      });
      
      unsubscribeRef.current = unsubscribe;
      
      // Mark messages as read
      if (currentUser) {
        const userType = selectedChat?.clientId === currentUser.uid ? 'client' : 'freelancer';
        await chatService.markMessagesAsRead(chatId, currentUser.uid, userType);
      }
      
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [currentUser, selectedChat]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser || sending) return;
    
    try {
      setSending(true);
      const userType = selectedChat.clientId === currentUser.uid ? 'client' : 'freelancer';
      
      await chatService.sendMessage({
        chatId: selectedChat.id,
        senderId: currentUser.uid,
        senderType: userType,
        content: newMessage.trim(),
        type: 'text',
        isRead: false
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectChat = (room: ChatRoom) => {
    setSelectedChat(room);
    loadMessages(room.id);
  };

  const getOtherParticipant = (room: ChatRoom): UserProfile | null => {
    if (!currentUser) return null;
    
    const otherUserId = room.clientId === currentUser.uid ? room.freelancerId : room.clientId;
    return userProfiles[otherUserId] || null;
  };

  const formatMessageTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  useEffect(() => {
    if (currentUser) {
      loadChatRooms();
    }
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [currentUser, loadChatRooms]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-background">
      {/* Chat List */}
      <div className="w-1/3 border-r bg-muted/10">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Messages</h3>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Input placeholder="Search conversations..." className="w-full" />
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {chatRooms.map((room) => {
              const otherParticipant = getOtherParticipant(room);
              const isActive = selectedChat?.id === room.id;
              const unreadCount = currentUser?.uid === room.clientId 
                ? room.unreadCount.client 
                : room.unreadCount.freelancer;
              
              return (
                <div
                  key={room.id}
                  onClick={() => selectChat(room)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherParticipant?.avatar} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium truncate">
                          {otherParticipant?.displayName || 'Unknown User'}
                        </h4>
                        {unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {room.lastMessage || 'No messages yet'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {room.lastMessageAt && formatMessageTime(room.lastMessageAt instanceof Date ? room.lastMessageAt : new Date(room.lastMessageAt))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getOtherParticipant(selectedChat)?.avatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">
                      {getOtherParticipant(selectedChat)?.displayName || 'Unknown User'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Project: {selectedChat.projectId}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === currentUser?.uid;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center mt-1 text-xs text-muted-foreground ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {formatMessageTime(message.timestamp)}
                          {isOwnMessage && (
                            <div className="ml-2">
                              {message.isRead ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={sending}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim() || sending}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a chat from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
