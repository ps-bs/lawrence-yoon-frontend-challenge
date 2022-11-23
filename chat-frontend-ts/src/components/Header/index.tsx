import { useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { AppContext } from '../../App/context';

import styles from './index.module.scss';

export const Header: React.FC = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { currentUser } = useContext(AppContext);

  return (
    <header className={styles.container}>
      <Link to="/">
        <img
          className={styles.logo}
          src="https://recess-images.imgix.net/guild_logos/guild/guild_color.svg"
          alt="logo"
          data-testid="logo"
        />
      </Link>
      <span
        className={styles.username}
        onClick={() => history.push(`${pathname}?isEditingName=true`)}
        role="button"
      >
        <p data-testid="username">{currentUser?.username ?? 'Pick a username'}</p>
      </span>
    </header>
  );
};
