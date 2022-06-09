import { Link } from 'react-router-dom';

import styles from './index.module.scss';

export const NewMessageButton: React.FC = () => (
  <Link to="/">
    <button className={styles.button} type="button">
      New message
    </button>
  </Link>
);
