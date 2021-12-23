import React, { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../../../context/socket';
import RoomUser from './RoomUser';
import { Typography, Divider, Box } from '@mui/material';

const UserList = () => {
  const { socket, currentRoom } = useContext(SocketContext);
  const [loggedInUsers, setLoggedInUsers] = useState(null);

  useEffect(() => {
    function listener({ users }) {
      setLoggedInUsers([...users]);
    }

    socket.emit('get-users-for-room', { room: currentRoom });
    socket.on('get-users-for-room', listener);

    return function cleanup() {
      socket.off('get-users-for-room', listener);
    };
  }, [socket, currentRoom]);

  return (
    <Box>
      <Typography>Users talking in {currentRoom}</Typography>
      <Divider />
      {loggedInUsers &&
        loggedInUsers.map(([username], idx) => {
          return <RoomUser username={username} key={idx} />;
        })}
    </Box>
  );
};

export default UserList;
