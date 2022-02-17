/* eslint no-unused-vars: 0, no-undef: 0 */
import React, { useEffect, createContext, useState } from 'react';
import { Dispatch } from 'redux';
import { io, Socket } from 'socket.io-client';
import { connect } from 'react-redux';
import { addMessageToRoom } from '../store/actions';
import { Message } from '../store/actions';

export const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}`);

interface SocketValuesInterface {
  currentRoom: string | undefined | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string | undefined>> | null;
  socket: Socket | null;
}

export const SocketContext = createContext<SocketValuesInterface | null>({} as SocketValuesInterface);

interface SocketProviderProps {
  children: React.ReactNode;
  addMessageToRoom: Function;
}

const SocketProvider = ({ children, addMessageToRoom }: SocketProviderProps) => {
  let [currentRoom, setCurrentRoom] = useState<string>();

  useEffect(() => {
    function listener(data: Message) {
      addMessageToRoom(data);
    }
    socket.on('message', listener);

    return function cleanup() {
      socket.off('message', listener);
    };
  }, [children, addMessageToRoom]);

  const socketValues: SocketValuesInterface = {
    currentRoom,
    setCurrentRoom,
    socket,
  };

  return (
    <SocketContext.Provider value={socketValues}>
      {children}
    </SocketContext.Provider>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addMessageToRoom: (message: Message) => dispatch(addMessageToRoom(message)),
});

export default connect(null, mapDispatchToProps)(SocketProvider);