import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { socket } from '../../services/sockerIo';
import NotificationList from '../../components/Nofication/NotificationList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotification } from '../../redux/actions/actionNotification';

const Notification = () => {
  const dispatch = useDispatch();
  const { isLoading, notification: reduxNotifications } = useSelector((state) => state.notification);
  const [notifications, setNotifications] = useState([]);

  // Lấy danh sách thông báo từ Redux khi component mount
  useEffect(() => {
    dispatch(fetchNotification());
  }, [dispatch]);

  // Đồng bộ dữ liệu thông báo từ Redux vào state local
  useEffect(() => {
    setNotifications(reduxNotifications);
  }, [reduxNotifications]);

  // Lắng nghe thông báo mới từ socket và cập nhật state local
  useEffect(() => {
    socket.on('pushnotification', (data) => {
      setNotifications((prev) => [data, ...prev]); // Thêm thông báo mới vào đầu danh sách
      console.log('Received notification:', data);
    });

    // Cleanup khi component bị unmount
    return () => {
      socket.off('pushnotification');
    };
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Đang tải thông báo...</Text>
      ) : notifications.length === 0 ? (
        <Text>Chưa có thông báo nào.</Text>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
});

export default Notification;
