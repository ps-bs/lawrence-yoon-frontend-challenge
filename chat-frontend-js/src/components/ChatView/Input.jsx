import { useContext, useState } from 'react';
import { useParams } from 'react-router';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

import styles from './index.module.scss';

export const ChatViewInput = () => {
  const { socket } = useContext(SocketContext);
  const { currentUser } = useContext(AppContext);
  const { conversationId } = useParams();
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setMessage(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('sendMessage', {
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
