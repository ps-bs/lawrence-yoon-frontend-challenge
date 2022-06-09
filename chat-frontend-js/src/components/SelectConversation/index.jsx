import { useContext, useState } from 'react';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';
import { useFilteredUsers } from '../../utils/useFilteredUsers';

export const SelectConversation = () => {
  const { socket } = useContext(SocketContext);
  const { currentUser } = useContext(AppContext);
  const [selectedUser, setSelectedUser] = useState();
  const users = useFilteredUsers();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    socket?.emit('startConversation', {
      userId: currentUser?.userId,
      recipientId: selectedUser,
    });
  };

  return (
    <div>
      <h2>
        Select an existing conversation from the left or pick a new user here to
        start chatting
      </h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="user">Choose a user:</label>
        <select
          defaultValue={'select-a-user'}
          id="user"
          name="user"
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
        >
          <option disabled value="select-a-user">
            Select a user
          </option>
          {users.map((u) => (
            <option key={`user-select-option-${u.userId}`} value={u.userId}>
              {u.username}
            </option>
          ))}
        </select>
        <input
          disabled={!selectedUser}
          type="submit"
          value="Start conversation"
        />
      </form>
    </div>
  );
};
