export interface IAppContext {
  conversations: Conversation[];
  currentUser?: User;
  messages: Message[];
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  users: User[];
}

export type User = {
  socketId?: string;
  userId: string;
  username: string;
};

export type Message = {
  body: string;
  conversationId: string;
  createdAt: Date;
  messageId: string;
  senderId: string; // user id from client
};

export type Conversation = {
  conversationId: string;
  userIds: string[];
};
