import { io } from 'socket.io-client';

import {IP_ADDRESS} from '@env'

const SERVER_URL = `http://${IP_ADDRESS}:3000`; // Địa chỉ server của bạn

// Khởi tạo socket với URL của server
const socket = io(SERVER_URL, {
  transports: ['websocket'],  // Chỉ sử dụng giao thức WebSocket
  reconnection: true,         // Tự động kết nối lại khi kết nối bị gián đoạn
  reconnectionAttempts: 5,    // Số lần tự động thử kết nối lại
  reconnectionDelay: 1000,    // Thời gian giữa các lần thử lại (ms)
});

// Sự kiện khi kết nối thành công
socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

// Lắng nghe sự kiện nhận tin nhắn từ server
socket.on('pushnotification', (data) => {
  console.log('Message received:', data);
  // Bạn có thể sử dụng logic khác để lưu thông báo hoặc cập nhật UI ở đây.
});

// Hàm gửi tin nhắn lên server
const sendMessage = (message) => {
  socket.emit('send_message', message);
};

export { socket, sendMessage };
