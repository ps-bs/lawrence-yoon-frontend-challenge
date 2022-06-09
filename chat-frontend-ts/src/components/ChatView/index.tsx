import { ChatViewHeader } from './Header';
import { ChatViewInput } from './Input';
import { ChatViewMessageList } from './MessageList';
import styles from './index.module.scss';

export const ChatView: React.FC = () => (
  <div className={styles.container}>
    <ChatViewHeader />
    <ChatViewMessageList />
    <ChatViewInput />
  </div>
);
