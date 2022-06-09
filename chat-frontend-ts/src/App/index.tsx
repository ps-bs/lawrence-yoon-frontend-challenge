import { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import io, { Socket } from 'socket.io-client';
import { v4 } from 'uuid';

import { ChatView } from '../components/ChatView';
import { Header } from '../components/Header';
import { LeftPanel } from '../components/LeftPanel';
import { SelectConversation } from '../components/SelectConversation';
import { UsernameModal } from '../components/UsernameModal';
import { SocketContext } from '../socket/context';

import { AppContext } from './context';
import styles from './index.module.scss';
import { Conversation, Message, User } from './types';




const socketPort = process.env.SOCKET_PORT || 3001;

export const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const socketEndpoint = `http://localhost:${socketPort}`;
    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');
    if (!userId || !username) {
      userId = v4();
      username = `user${Date.now()}`;
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
    }

    setCurrentUser({
      userId,
      username,
    });

    setSocket(
      io(socketEndpoint, {
        transports: ['websocket'],
        upgrade: false,
        query: {
          userId,
          username,
        },
      })
    );
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('conversations', (conversations: Conversation[]) =>
        setConversations(conversations)
      );
      socket.on('users', (users: User[]) => setUsers(users));
      socket.on('message', (message: Message) =>
        setMessages((oldMessages) => [...oldMessages, message])
      );
      socket.on('messages', (messages: Message[]) => setMessages(messages));
    }
  }, [socket]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        messages,
        users,
        setUsers,
        conversations,
      }}
    >
      <SocketContext.Provider value={{ socket }}>
        <Header />
        <div className={styles.container}>
          <LeftPanel />
          <Switch>
            <Route exact path="/">
              <SelectConversation />
            </Route>
            <Route path="/conversation/:conversationId">
              <ChatView />
            </Route>
            <Route>not found :(</Route>
          </Switch>
        </div>
        <UsernameModal />
      </SocketContext.Provider>
    </AppContext.Provider>
  );
};
