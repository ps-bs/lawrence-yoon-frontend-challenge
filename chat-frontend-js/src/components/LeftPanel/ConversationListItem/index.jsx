import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import styles from './index.module.scss';

export const ConversationListItem = ({ conversationId, username, socketId }) => (
  <li
    className={classnames(styles.container, {
      [`${styles.online}`]: !!socketId,
    })}
  >
    <NavLink
      activeClassName={styles.active}
      className={styles.link}
      isActive={(match) => !!match}
      to={`/conversation/${conversationId}`}
    >
      <p className={styles.name}>{username}</p>
    </NavLink>
  </li>
);
