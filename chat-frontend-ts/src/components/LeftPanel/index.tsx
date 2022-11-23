import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { useContext } from 'react';

import { AppContext } from '../../App/context';
import { useFilteredUsers } from '../../utils/useFilteredUsers';

import { ChannelListItem } from './ChannelListItem';
import { ConversationListItem } from './ConversationListItem';
import styles from './index.module.scss';

export const LeftPanel: React.FC = () => {
  const { currentUser, conversations } = useContext(AppContext);
  const filteredUsers = useFilteredUsers();

  const channels = conversations.filter((c) => c?.conversationName);
  const directConversations = conversations.filter((c) => !c?.conversationName && c.userIds.includes(currentUser?.userId ?? ''));

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Button href="/" variant="outlined" sx={{ backgroundColor: '#fff', maxWidth: 200, mb: 3, marginLeft: '76px' }} endIcon={<EditIcon />}>
          New message
        </Button>
      </div>
      <div className={styles.row}>
        <Button href="/newChannel" variant="outlined" sx={{ backgroundColor: '#fff', mb: 3, maxWidth: 200, marginLeft: '76px' }} endIcon={<EditIcon />}>
          New channel
        </Button>
      </div>
      <div className={styles.row}>
        <h2>Channels</h2>
      </div>
      <ul>
        {channels.map(c => (
          <ChannelListItem
            key={c.conversationId}
            {...c}
          />
        ))}
      </ul>
      <div className={styles.row}>
        <h2>Direct Messages</h2>
      </div>
      <ul>
        {directConversations.map((c) => {
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
              typing={c.typingUserIds?.includes(otherUser.userId)}
              {...otherUser}
            />
          );
        })}
      </ul>
    </div>
  );
};
