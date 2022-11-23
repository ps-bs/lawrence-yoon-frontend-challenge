import { Theme, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';
import { useFilteredUsers } from '../../utils/useFilteredUsers';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    color: theme.palette.secondary.dark,
  },
  subtitle: {
    color: theme.palette.secondary.main,
  },
  form: {
    display: 'flex',
  },
  formLabel: {
    color: theme.palette.secondary.dark,
  },
}));

export const SelectConversation: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { socket } = useContext(SocketContext);
  const { currentUser, conversations } = useContext(AppContext);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const users = useFilteredUsers();

  const handleStartConversation = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    for (const conversation of conversations) {
      if (!conversation?.conversationName && conversation.userIds.includes(currentUser?.userId ?? '') && conversation.userIds.includes(selectedUser)) {
        history.push(`/conversation/${conversation.conversationId}`);
        return;
      }
    }

    socket?.emit('startConversation', {
      userId: currentUser?.userId,
      recipientId: selectedUser,
    });
  };

  return (
    <Box sx={{ p: 5 }}>
      <h1 className={classes.title}>New message</h1>
      <h2 className={classes.subtitle}>Select an existing conversation from the left or pick a new user here to start chatting:</h2>
      <InputLabel id="user-select-label" className={classes.formLabel}>User</InputLabel>
      <Box className={classes.form}>
        <FormControl sx={{ mr: 2, minWidth: 200 }}>
          <Select
            id="user-select"
            name="user"
            labelId="user-select-label"
            value={selectedUser}
            displayEmpty
            onChange={(e) => setSelectedUser(e.target.value)}
            data-testid="user-select"
          >
            <MenuItem disabled value="" sx={{ display: 'none' }}>Select one</MenuItem>
            {users.map((u) => (
              <MenuItem key={u.userId} value={u.userId}>{u.username}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          disabled={!selectedUser}
          variant="contained"
          onClick={handleStartConversation}
          data-testid="start-conversation-button"
        >
          Start conversation
        </Button>
      </Box>
    </Box>
  );
};
