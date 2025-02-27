export type User = {
  /**
   * String representing the socket id or null if user is now disconnected
   */
  socketId?: string;
  /**
   * String (uuid) generated on client to "persist" user across client sessions
   */
  userId: string;
  /**
   * String provided by the client 
   */
  username: string;
}

export type Message = {
  body: string;
  conversationId: string;
  createdAt: Date;
  messageId: string;
  senderId: string; // user id from client
}

export type Conversation = {
  conversationId: string;
  conversationName?: string;
  userIds: string[];
  typingUserIds: string[];
}

export type Typing = {
  conversationId: string;
  userId: string; // user id from client
}
