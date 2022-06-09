import '@reach/dialog/styles.css';
import { Dialog } from '@reach/dialog';
import qs from 'qs';
import { useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import { v4 } from 'uuid';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

import styles from './index.module.scss';

export const UsernameModal= () => {
  const { pathname, search } = useLocation();
  const history = useHistory();
  const parsedParams = qs.parse(search, { ignoreQueryPrefix: true });
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  const handleChange = (e) => {
    if (currentUser?.userId) {
      setCurrentUser({
        username: e.target.value,
        userId: currentUser.userId,
      });
    } else {
      setCurrentUser({
        username: e.target.value,
        userId: v4(),
      });
    }
    localStorage.setItem('username', e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`${pathname}`);
    socket?.emit('username', currentUser);
  };

  return (
    <Dialog
      aria-label="Username input"
      isOpen={Boolean(parsedParams.isEditingName) || false}
      onDismiss={() => history.push(`${pathname}`)}
    >
      <form className={styles.formControl} onSubmit={handleSubmit}>
        <label htmlFor="username">Edit your name</label>
        <input
          aria-label="Edit your name"
          type="text"
          name="username"
          id="username"
          onChange={handleChange}
          value={currentUser ? currentUser.username : ''}
          placeholder="Enter your name"
        />
        <input type="submit" value="submit" />
      </form>
    </Dialog>
  );
};
