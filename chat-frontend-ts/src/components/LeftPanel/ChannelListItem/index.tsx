import { NavLink } from 'react-router-dom';

import { Conversation } from '../../../App/types';

import styles from './index.module.scss';

export const ChannelListItem: React.FC<Conversation> = ({ conversationId, conversationName }) => (
  <li
    className={styles.container}
  >
    <NavLink
      activeClassName={styles.active}
      className={styles.link}
      isActive={(match) => !!match}
      to={`/conversation/${conversationId}`}
    >
      <p className={styles.name}>{conversationName}</p>
    </NavLink>
  </li>
);
