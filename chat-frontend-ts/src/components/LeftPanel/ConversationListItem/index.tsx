import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { NavLink } from 'react-router-dom';

import { User } from '../../../App/types';

import styles from './index.module.scss';

export const ConversationListItem: React.FC<
  User & { conversationId: string, typing?: boolean }
> = ({ conversationId, username, socketId, typing }) => (
  <li
    className={styles.container}
  >
    <NavLink
      activeClassName={styles.active}
      className={styles.link}
      isActive={(match) => !!match}
      to={`/conversation/${conversationId}`}
    >
      {typing ? (
        <MoreHorizIcon className={styles.statusTyping} data-testid="status-typing" />
      ) : (socketId ? (
        <span className={styles.statusOnline} data-testid="status-online" />
      ) : (
        <span className={styles.statusOffline} data-testid="status-offline" />
      ))}
      <p className={styles.name}>{username}</p>
    </NavLink>
  </li>
);
