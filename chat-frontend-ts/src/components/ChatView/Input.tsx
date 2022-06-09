import { useContext, useState } from 'react';
import { useParams } from 'react-router';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

import styles from './index.module.scss';

export const ChatViewInput: React.FC = () => {
  const { socket } = useContext(SocketContext);
  const { currentUser } = useContext(AppContext);
  const { conversationId } = useParams<{ conversationId: string }>();
  const [message, setMessage] = useState('');

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setMessage(e.target.value);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    socket?.emit('sendMessage', {
      body: message,
      conversationId,
      senderId: currentUser?.userId,
    });

    setMessage('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        aria-label="Your message"
        onChange={handleChange}
        placeholder='Type your message here. Press "Enter" or "Send"'
        value={message}
      />
      <input className={styles.submit} type="submit" value="Send" />
    </form>
  );
};
