import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import {IP_ADDRESS} from '@env'
const WebSocketExample = () => {
  // Tạo một tham chiếu cho WebSocket để giữ kết nối
  const ws = useRef(null);

  useEffect(() => {
    // Khởi tạo kết nối WebSocket với địa chỉ server
    ws.current = new WebSocket(IP_ADDRESS); // Thay địa chỉ localhost bằng địa chỉ server WebSocket của bạn
    
    // Xử lý sự kiện khi WebSocket kết nối thành công
    ws.current.onopen = () => {
      console.log('WebSocket connection opened');

      

      // Bạn có thể gửi thông điệp đầu tiên để đăng ký người dùng sau khi kết nối thành công
      const token = localStorage.getItem('token') // Thay bằng token thực tế của người dùng sau khi đăng nhập
      ws.current.send(JSON.stringify({
        type: 'REGISTER',
        token: token,
      }));
    };

    // Xử lý khi nhận được thông điệp từ server
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'CONNECTED') {
        console.log('Kết nối WebSocket thành công:', data.message);
      }

      if (data.type === 'REGISTER_SUCCESS') {
        console.log('Người dùng đã đăng ký hoặc cập nhật thành công:', data.message);
      }

      if (data.type === 'REGISTER_FAILED') {
        console.error('Đăng ký thất bại:', data.message);
      }
    };

    // Xử lý lỗi WebSocket
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error.message);
    };

    // Xử lý khi kết nối WebSocket bị đóng
    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Dọn dẹp khi component unmount (đóng kết nối WebSocket)
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <View>
      <Text>WebSocket Connection Example</Text>
    </View>
  );
};

export default WebSocketExample;
