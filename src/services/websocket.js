import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';
import tokenService from './tokenService';

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  async connect() {
    console.log(IP_ADDRESS);
    
    const token = await tokenService.getToken();
    if (!token) {
      console.error('No token found, cannot connect to WebSocket');
      return;
    }

    // Khởi tạo WebSocket và gán cho `this.socket`
    this.socket = new WebSocket(`ws://10.0.3.2:3000/ws`); // Sử dụng biến IP_ADDRESS từ .env để kết nối

    // Khi WebSocket kết nối thành công
    this.socket.onopen = () => {
      console.log('WebSocket connection opened');

      // Gửi token để xác thực người dùng
      this.socket.send(JSON.stringify({
        type: 'REGISTER',
        token: token,
      }));
    };

    // Xử lý khi nhận được thông điệp từ server
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data from server:', data);
    };

    // Xử lý lỗi
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error.message);
    };

    // Xử lý khi kết nối WebSocket bị đóng
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  // Đóng kết nối WebSocket khi không cần thiết
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

// Tạo một instance của WebSocketService để sử dụng trong toàn bộ ứng dụng
const webSocketService = new WebSocketService();
export default webSocketService;
