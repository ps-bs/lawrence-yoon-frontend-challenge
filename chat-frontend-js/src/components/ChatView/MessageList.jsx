import { useContext, useEffect } from 'react';
import { useParams } from 'react-router';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

import { ChatViewMessage } from './Message';
import styles from './index.module.scss';

export const ChatViewMessageList = () => {
  const { socket } = useContext(SocketContext);
  const { conversationId } = useParams();
  const { messages } = useContext(AppContext);

  useEffect(() => {
    socket.emit('getConversationMessages', { conversationId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMessages = messages.filter(
    (m) => m.conversationId === conversationId
  );

  return (
    <div className={styles.messageList}>
      {filteredMessages.map((m) => (
        <ChatViewMessage key={m.messageId} {...m} />
      ))}
    </div>
  );
};
