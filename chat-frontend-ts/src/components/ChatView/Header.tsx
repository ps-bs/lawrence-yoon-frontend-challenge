import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AppContext } from '../../App/context';
import { useFilteredUsers } from '../../utils/useFilteredUsers';

import styles from './index.module.scss';

export const ChatViewHeader: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const filteredUsers = useFilteredUsers();
  const { conversations } = useContext(AppContext);

  const conversation = conversations.find(
    (c) => c.conversationId === conversationId
  );
  if (!conversation) {
    return (
      <div>
        <p>
          uh oh, we couldn&apost find a conversation with id: {conversationId}
        </p>
      </div>
    );
  }

  if (conversation.conversationName) {
    return (
      <div className={styles.header}>
        <h1>{conversation.conversationName}</h1>
        <h2>Joined users: {conversation.userIds.length}</h2>
      </div>
    );
  }

  const viewedUser = filteredUsers.find((u) =>
    conversation.userIds.includes(u.userId)
  );

  if (!viewedUser) {
    return (
      <div>
        <p>uh oh, we couldn&apost find another user for this conversation</p>
      </div>
    );
  }

  return (
    <div className={styles.header}>
      <h1>{viewedUser.username}</h1>
      {viewedUser.socketId ? (
        <div className={styles.statusOnline}>
          <div className={styles.status} />Online
        </div>
      ) : (
        <div className={styles.statusOffline}>
          <div className={styles.status} />Offline
        </div>
      )}
    </div>
  );
};
