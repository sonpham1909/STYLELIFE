import React, { useCallback, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Alert,
  Modal,
} from 'react-native';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import Nofication from '../screens/Nofication/Nofication';
import Favotires from '../screens/Favotires/Favotires';
import Personal from '../screens/Personal/Personal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/actions/actionCart';
import PushNotification from 'react-native-push-notification';
import { socket } from '../services/sockerIo';


const Tab = createBottomTabNavigator();

const CustomHomeHeader = () => {
  const dispatch = useDispatch();
  const { cart, cartLength, isLoading } = useSelector(state => state.cart);
  const [isModalSearch, setisModalSearch] = useState(false);

  const handlePressSearchModal = () => {
    navigation.navigate('StartSearch')

  }

  const Onclose = () => {
    setisModalSearch(false);
  }

  //gửi text để tìm kiếm
  handleOnSearch = (searchKeyword) => {

    if (searchKeyword) {
      navigation.navigate('SearchScreen', { searchKeyWord: searchKeyword }, { merge: true });
    }

  }
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCart());
    }, [dispatch])
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  useEffect(() => {
    if (!isLoading) {
      console.log('Cart:', cartLength);
    }
  }, [isLoading, cart]);


  useEffect(() => {
    async function setupNotificationChannel() {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Thông báo cần quyền",
            message: "Ứng dụng cần quyền để gửi thông báo cho bạn",
            buttonNeutral: "Hỏi sau",
            buttonNegative: "Từ chối",
            buttonPositive: "Đồng ý"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Quyền thông báo bị từ chối");
        }
      }

      PushNotification.createChannel(
        {
          channelId: "order-channel", // ID của kênh này cần phải là duy nhất
          channelName: "Order Notifications", // Tên kênh
          channelDescription: "A channel to categorize your order notifications", // Miêu tả kênh
          importance: PushNotification.Importance.HIGH, // Độ quan trọng của kênh (LOW, HIGH, DEFAULT)
          vibrate: true, // Rung khi nhận thông báo
        },
        (created) => console.log(`createChannel returned '${created}'`) // Log kết quả tạo kênh
      );
    }

    setupNotificationChannel();
  }, []);

  // Lắng nghe thông báo từ server thông qua socket
  useEffect(() => {
    socket.on('pushnotification', (data) => {
      console.log('Notification received:', data);

      // Hiển thị thông báo cục bộ
      PushNotification.localNotification({
        channelId: "order-channel", // Sử dụng kênh đã tạo
        title: data.title || "Thông báo", // Tiêu đề của thông báo
        message: data.message || "Bạn có một thông báo mới.", // Nội dung của thông báo
        playSound: true, // Phát âm thanh khi có thông báo
        soundName: 'default', // Sử dụng âm thanh mặc định
        vibrate: true, // Rung khi có thông báo đến
        vibration: 300, // Độ dài của rung
        importance: 'high', // Độ quan trọng của thông báo
        priority: "high", // Ưu tiên của thông báo
      });
    });

    // Cleanup khi component bị unmount
    return () => {
      socket.off('pushnotification');
      socket.off('connect');
    };
  }, []);

  const CountCart = cartLength ? cartLength : 0;

  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [cartItemCount, setCartItemCount] = useState(3); // Đặt giả định là 3 sản phẩm trong giỏ

  const handleTextChange = text => {
    if (text.length <= 39) {
      setSearchText(text);
    } else {
      Alert.alert('Thông báo', 'Bạn không thể nhập quá 40 ký tự!');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Image
          source={require('../assets/images/home_search.png')}
          style={styles.icon}
        />
        <TouchableOpacity
          style={{
            flex: 1,
            height: 40,
            zIndex: 2
          }}
          onPress={handlePressSearchModal}>
          <TextInput
            placeholder="Tìm Kiếm..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleTextChange} // Cập nhật text khi người dùng nhập
            maxLength={40} // Giới hạn số ký tự

            editable={false}
            pointerEvents='none'

          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => navigation.navigate('Cart')}>
        <View style={styles.notificationIconContainer}>
          <MaterialCommunityIcons
            name="cart-outline" // Icon giỏ hàng
            size={24} // Kích thước của icon
            color="#00A65E" // Màu sắc của icon
          />
          {CountCart > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{cartLength}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <SearchModal visible={isModalSearch} onClose={Onclose} onSearch={handleOnSearch} />

    </View>
  );
};


const SearchModal = ({ visible, onClose, onSearch }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const handleBackPress = () => {
    if (searchKeyword) {
      // Nếu có text thì xóa hết text
      setSearchKeyword("");
    } else {
      // Nếu không có text thì thoát modal
      onClose();
    }
  };

  const handleClearText = () => {
    setSearchKeyword("");
  };


  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.headerModalContainer}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left" // Icon quay lại
              size={24} // Kích thước của icon
              color="#00A65E" // Màu sắc của icon
            />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInputModal}
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              onSubmitEditing={() => onSearch(searchKeyword)}
              autoFocus={true}
            />
            {searchKeyword.length > 0 && (
              <TouchableOpacity onPress={handleClearText} style={styles.clearIcon}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#00A65E" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => onSearch(searchKeyword)}
            >
              <MaterialCommunityIcons
                name="magnify" // Icon tìm kiếm
                size={24} // Kích thước của icon
                color="white" // Màu sắc của icon
              />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Yêu thích') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Thông báo') {
            iconName = focused ? 'bell' : 'bell-outline';
          } else if (route.name === 'Cá nhân') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#00A65E',
        tabBarInactiveBackgroundColor: '#00A65E',
        tabBarStyle: {
          backgroundColor: '#00A65E',
        },
        headerStyle: {
          backgroundColor: '#00A65E',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          headerTitle: props => <CustomHomeHeader {...props} />, // Set custom header
        }}
      />
      <Tab.Screen
        name="Yêu thích"
        component={Favotires}
        options={{ title: 'Yêu thích', headerTitleAlign: 'center' }}
      />
      <Tab.Screen
        name="Thông báo"
        component={Nofication}
        options={{ title: 'Thông báo', headerTitleAlign: 'center' }}
      />
      <Tab.Screen
        name="Cá nhân"
        component={Personal}
        options={{ title: 'Cá nhân', headerTitleAlign: 'center' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: 330,
    justifyContent: 'space-between', // Để phân chia không gian giữa các phần tử
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    zIndex: 1
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  notificationButton: {
    padding: 10,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10, // Khoảng cách giữa biểu tượng và ô input
  },
  notificationIconContainer: {
    width: 35, // Đặt chiều rộng cho hình tròn
    height: 35, // Đặt chiều cao cho hình tròn
    borderRadius: 20, // Bán kính để tạo hình tròn
    backgroundColor: 'white', // Màu nền
    justifyContent: 'center',
    alignItems: 'center', // Canh giữa nội dung
  },
  badgeContainer: {
    position: 'absolute',
    right: -5, // Tùy chỉnh vị trí để badge nằm ở góc trên bên phải của icon
    top: -5, // Tùy chỉnh vị trí
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40, // Đặt padding trên để thanh tìm kiếm nằm ở phía trên cùng
  },
  backButton: {
    paddingRight: 10,
  },
  searchInputModal: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#00A65E',
    borderRadius: 8,
    padding: 10,
  },
  searchButton: {
    backgroundColor: '#00A65E',
    padding: 10,

    marginLeft: 10,

  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#00A65E',
    borderRadius: 8,
    paddingLeft: 10,
    marginLeft: 10,
  },
  searchInputModal: {
    flex: 1,
    height: 40,
  },
  clearIcon: {
    marginLeft: 5,
  },
});

export default BottomTabNavigator;
