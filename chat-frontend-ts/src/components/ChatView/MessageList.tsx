import { useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

import { ChatViewMessage } from './Message';
import styles from './index.module.scss';

export const ChatViewMessageList: React.FC = () => {
  const { socket } = useContext(SocketContext);
  const { conversationId } = useParams<{ conversationId: string }>();
  const { currentUser, messages } = useContext(AppContext);
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight - ref.current.clientHeight;
    }
  };

  useEffect(() => {
    if (currentUser) {
      socket?.emit('getConversationMessages', { conversationId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, conversationId]);

  useEffect(() => {
    socket?.on('messagesLoaded', scrollToBottom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMessages = messages.filter(
    (m) => m.conversationId === conversationId
  );

  return (
    <div className={styles.messageListScrollWrapper} ref={ref}>
      <div className={styles.messageListWrapper}>
        <div className={styles.messageList}>
          {filteredMessages.map((m) => (
            <ChatViewMessage key={m.messageId} {...m} />
          ))}
        </div>
      </div>
    </div>
  );
};
