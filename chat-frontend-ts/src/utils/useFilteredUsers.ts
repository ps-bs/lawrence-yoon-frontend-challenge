import { useContext } from 'react';

import { AppContext } from '../App/context';
import { User } from '../App/types';

export const useFilteredUsers = (): User[] => {
  const { currentUser, users } = useContext(AppContext);
  return users.filter((u) => u.userId !== currentUser?.userId);
};
