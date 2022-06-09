import { useContext } from 'react';

import { AppContext } from '../../App/context';
import { useFilteredUsers } from '../../utils/useFilteredUsers';
import { NewMessageButton } from '../NewMessageButton';

import { ConversationListItem } from './ConversationListItem';
import styles from './index.module.scss';

export const LeftPanel = () => {
  const { conversations } = useContext(AppContext);
  const filteredUsers = useFilteredUsers();

  return (
    <div className={styles.container}>
      <NewMessageButton />
      <h2>Direct Messages</h2>
      <ul>
        {conversations.map((c) => {
          const otherUser = filteredUsers.find((u) =>
            c.userIds.includes(u.userId)
          );
          // null check to appease ts
          if (!otherUser) {
            return null;
          }
          return (
            <ConversationListItem
              conversationId={c.conversationId}
              key={c.conversationId}
              {...otherUser}
            />
          );
        })}
      </ul>
    </div>
  );
};
