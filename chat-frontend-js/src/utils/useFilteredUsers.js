import { useContext } from 'react';

import { AppContext } from '../App/context';

export const useFilteredUsers = () => {
  const { currentUser, users } = useContext(AppContext);
  return users.filter((u) => u.userId !== currentUser.userId);
};
