import { Theme, Box, Button, FormControl, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useContext, useState } from 'react';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

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

export const CreateChannel: React.FC = () => {
  const classes = useStyles();
  const { socket } = useContext(SocketContext);
  const { currentUser } = useContext(AppContext);
  const [channelName, setChannelName] = useState<string>('');

  const handleStartChannel = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    socket?.emit('startChannel', {
      userId: currentUser?.userId,
      conversationName: channelName,
    });

    setChannelName('');
  };

  return (
    <Box sx={{ p: 5 }}>
      <h1 className={classes.title}>New channel</h1>
      <h2 className={classes.subtitle}>Create a new channel to start chatting:</h2>
      <Box className={classes.form}>
        <FormControl sx={{ mr: 2, minWidth: 200 }}>
          <TextField
            autoFocus
            margin="dense"
            aria-label="Type channel name"
            label="New channel name"
            type="text"
            name="channelname"
            id="channelname"
            fullWidth
            variant="outlined"
            onChange={(e) => setChannelName(e.target.value)}
            value={channelName}
            placeholder="Enter channel name"
            data-testid="channel-name-input"
          />
        </FormControl>
      </Box>
      <Button
        disabled={!channelName}
        variant="contained"
        onClick={handleStartChannel}
        data-testid="create-channel-button"
      >
        Create channel
      </Button>
    </Box>
  );
};
