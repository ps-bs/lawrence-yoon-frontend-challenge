import { Button } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

import styles from './index.module.scss';

export const ChatViewInput: React.FC = () => {
  const { socket } = useContext(SocketContext);
  const { currentUser, conversations } = useContext(AppContext);
  const { conversationId } = useParams<{ conversationId: string }>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (message) {
        socket?.emit('startTyping', {
          conversationId,
          userId: currentUser?.userId,
        });
      } else {
        socket?.emit('endTyping', {
          conversationId,
          userId: currentUser?.userId,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, message]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setMessage(e.target.value);

  const handleSendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    socket?.emit('sendMessage', {
      body: message,
      conversationId,
      senderId: currentUser?.userId,
    });

    setMessage('');
  };

  const handleJoinChannel: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    socket?.emit('joinChannel', {
      conversationId,
      userId: currentUser?.userId,
    });
  };

  const conversation = conversations.find(c => c.conversationId === conversationId);

  if (conversation?.conversationName && !conversation.userIds.includes(currentUser?.userId ?? '')) {
    return (
      <form className={styles.form} onSubmit={handleJoinChannel}>
        <Button type="submit" variant="contained" data-testid="join-button">
          Join channel
        </Button>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSendMessage}>
      <input
        className={styles.input}
        aria-label="Your message"
        onChange={handleChange}
        placeholder='Type your message here, press `Enter` or `Send`'
        value={message}
        data-testid="message-input"
      />
      <Button type="submit" variant="contained" sx={{ ml: 2 }} disabled={!message} data-testid="send-button">
        Send
      </Button>
    </form>
  );
};
