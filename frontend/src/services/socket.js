import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinOrder(orderId) {
    if (this.socket) {
      this.socket.emit('join-order', orderId);
    }
  }

  leaveOrder(orderId) {
    if (this.socket) {
      this.socket.emit('leave-order', orderId);
    }
  }

  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('order-updated', callback);
    }
  }

  offOrderUpdate() {
    if (this.socket) {
      this.socket.off('order-updated');
    }
  }
}

export default new SocketService();