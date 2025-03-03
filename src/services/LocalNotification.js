import PushNotification from 'react-native-push-notification'

const LocalNotification = () => {
    const channelId = "local-channel"; // Key must be fixed to match between createChannel and localNotification

    PushNotification.configure({
        onNotification: function (notification) {
          console.log("NOTIFICATION:", notification);
        },
        requestPermissions: true, // Điều này đặc biệt quan trọng để đảm bảo app yêu cầu quyền
      });
      

    // Tạo kênh thông báo
    PushNotification.createChannel(
        {
            channelId: channelId, // (required) Channel ID cố định
            channelName: "Local Messages", // (required) Tên kênh
            channelDescription: "Notification for Local messages", // (optional) Mô tả cho kênh
            importance: 4, // (optional) Độ quan trọng của kênh thông báo
            vibrate: true, // (optional) Cho phép rung khi có thông báo
        },
        (created) => console.log(`createChannel returned '${created}'`) // Log việc tạo kênh
    );

    // Gửi thông báo cục bộ
    PushNotification.localNotification({
        channelId: channelId, // Channel ID phải giống với ID đã tạo từ trước
        title: 'Local Message',
        message: 'This is a local notification message!', // Nội dung của thông báo
        playSound: true, // Phát âm thanh khi có thông báo
        soundName: 'default', // Sử dụng âm thanh mặc định
        importance: 'high', // Độ quan trọng của thông báo
        priority: "high", // Ưu tiên của thông báo
        vibrate: true, // Rung khi có thông báo
        vibration: 300, // Độ dài của rung (ms)
    });
};

export default LocalNotification;
