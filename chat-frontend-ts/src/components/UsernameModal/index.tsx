import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel, Button, TextField } from '@mui/material';
import qs from 'qs';
import { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { v4 } from 'uuid';

import { AppContext } from '../../App/context';
import { SocketContext } from '../../socket/context';

export const UsernameModal: React.FC = () => {
  const { pathname, search } = useLocation();
  const history = useHistory();
  const parsedParams = qs.parse(search, { ignoreQueryPrefix: true });
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    history.push(`${pathname}`);
    socket?.emit('username', currentUser);
  };

  const handleClose = () => history.push(`${pathname}`);

  return (
    <Dialog open={Boolean(parsedParams.isEditingName) || false} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ p: 4, pb: 0 }}>
        Edit your name
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 8 }}>
        <DialogContentText sx={{ mb: 4 }}>
          Edit how your name displays when others chat with you.
        </DialogContentText>
        <InputLabel htmlFor="username">Name</InputLabel>
        <FormControl>
          <TextField
            autoFocus
            margin="dense"
            aria-label="Edit your name"
            type="text"
            name="username"
            id="username"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            value={currentUser?.username || ''}
            placeholder="Enter your name"
            data-testid="username-input"
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Button variant="outlined" onClick={handleClose} data-testid="cancel-button">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} data-testid="save-button">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
