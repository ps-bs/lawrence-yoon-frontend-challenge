import { createContext } from 'react';

const defaultAppContext = {
  conversations: [],
  messages: [],
  setCurrentUser: () => null,
  setUsers: () => null,
  users: [],
};

export const AppContext = createContext(defaultAppContext);
