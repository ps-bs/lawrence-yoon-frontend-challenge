import { format, formatRelative } from 'date-fns';
import { useContext } from 'react';

import { AppContext } from '../../App/context';
import { Message } from '../../App/types';

import styles from './index.module.scss';

export const ChatViewMessage: React.FC<Message> = (message) => {
  const { users } = useContext(AppContext);
  const sender = users.find((u) => u.userId === message.senderId);
  const relativeDay = formatRelative(new Date(message.createdAt), new Date())
    .split('at')[0]
    .trim();

  return (
    <div>
      <span className={styles.messageContainer}>
        <p className={styles.senderName}>{sender?.username}</p>
        <p className={styles.sentAt}>
          {format(new Date(message.createdAt), 'h:mm a ')} {relativeDay}
        </p>
      </span>
      <p className={styles.messageBody}>{message.body}</p>
    </div>
  );
};
