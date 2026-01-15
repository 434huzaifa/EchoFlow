import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  autoConnect: false,
});

export const initializeSocket = (accessToken) => {
  if (accessToken) {
    socket.auth = { token: accessToken };
    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };
  }
  if (!socket.connected) {
    socket.connect();
  }
};

export const updateSocketAuth = (accessToken) => {
  if (accessToken) {
    socket.auth = { token: accessToken };
    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };
    if (!socket.connected) {
      socket.connect();
    } else {
      socket.disconnect().connect();
    }
  } else {
    socket.disconnect();
  }
};

export const socketBaseQuery = () => async (args) => {
  return new Promise((resolve) => {
    const { event, payload, timeout = 5000 } = args;

    const timeoutId = setTimeout(() => {
      resolve({ error: 'Request timeout' });
    }, timeout);

    socket.emit(event, payload, (response) => {
      clearTimeout(timeoutId);
      resolve({ data: response });
    });
  });
};
