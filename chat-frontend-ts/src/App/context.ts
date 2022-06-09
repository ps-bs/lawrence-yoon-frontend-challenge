import { createContext } from 'react';

import { IAppContext } from './types';

const defaultAppContext: IAppContext = {
  conversations: [],
  messages: [],
  setCurrentUser: () => null,
  setUsers: () => null,
  users: [],
};
export const AppContext = createContext<IAppContext>(defaultAppContext);
