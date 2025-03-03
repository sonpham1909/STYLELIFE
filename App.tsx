
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import Welcom from './src/screens/Welcom/SplashScreen';
import Registered from './src/screens/Registered/Registered';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { Linking } from 'react-native';
import { createRef } from 'react';

import CategoriesScreen from './src/screens/CategoriesScreen/CategoriesScreen';
import InvoicesScreen from './src/screens/InvoicesScreen/InvoicesScreen';
import ReviewsScreen from './src/screens/ReviewsScreen/ReviewsScreen';
// Đường dẫn tới store.js
import { Provider } from 'react-redux'; // Thêm import Provider từ react-redux
import CateClother from './src/screens/CateClotherScreen/CateClotherScreen';
import Cart from './src/screens/Cart/Cart';
import Checkout from './src/screens/CheckOut/Checkout';
import Favorites from './src/screens/Favotires/Favotires';
import Notification from './src/screens/Nofication/Nofication';
import DetailedOrders from './src/screens/DetailedOrders/DetailedOrders';
import ProductDetailScreen from './src/screens/ProductDetailScreen/ProductDetailScreen';
import Congrats from './src/screens/Congrats/Congrats';
import AllProductScreen from './src/screens/AllProductScreen/AllProductScreen';
import SettingScreen from './src/screens/SettingScreen/SettingScreen';
import ShippingAddressScreen from './src/screens/ShippingAddressScreen/ShippingAddressScreen';
import AddAddress from './src/screens/ShippingAddressScreen/AddAddressScreen';
import store from './src/redux/store/store';
import DeliveredOrders from './src/screens/DeliveredOrders/DeliveredOrders';
import AddReview from './src/screens/AddReview/AddReview';
import MessageScreen from './src/screens/MessageScreen/MessageScreen';

import ResetPassword from './src/screens/LoginScreen/ResetPasswordScreen'

import SearchScreen from './src/screens/SearchScreen/SearchScreen';
import StartSearch from './src/screens/SearchScreen/StartSearch';
import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";

const Stack = createStackNavigator();
export const navigationRef = createRef();
// import queryString from 'query-string';

const App = () => {
  useEffect(() => {
    // Configure Push Notification khi ứng dụng khởi chạy
    PushNotification.configure({
      // (optional) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
  
        // Không cần gọi finish() vì không sử dụng iOS hoặc Hermes gây lỗi
      },
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      // Yêu cầu quyền trên iOS (nếu cần thiết)
      requestPermissions: Platform.OS === 'ios',
    });
  
    // Tạo kênh thông báo
 
  }, []);
  
 
  useEffect(() => {
    // Lắng nghe sự kiện deep link
    const handleDeepLink = event => {
      const url = event.url;
      console.log('Received deep link URL:', url);

      // Xử lý URL để điều hướng đến trang phù hợp
      if (url.includes('payment-success')) {
        navigationRef.current?.navigate('Congrats');


      } else if (url.includes('payment-failure')) {
        navigationRef.current?.navigate('Home');
      }
    };

    const linkingSubscription = Linking.addListener('url', handleDeepLink);

    // Xóa sự kiện khi component unmount
    return () => {
      linkingSubscription.remove();
    };
  }, []);
  //   } else if (url.includes('reset-password')) {
  //     const parsedUrl = queryString.parseUrl(url);
  //     const token = parsedUrl.query.token;

  //     console.log('Received token:', token);

  //     navigationRef.current?.navigate('ResetPassword', { token });
  //   }
  // };

  // useEffect(() => {
  //   // Xử lý deep link khi app đã được mở
  //   const subscription = Linking.addEventListener('url', (event) => {
  //     handleDeepLink(event.url);
  //   });

  //   // Xử lý deep link khi app chưa mở
  //   const getInitialURL = async () => {
  //     const initialUrl = await Linking.getInitialURL();
  //     if (initialUrl) {
  //       handleDeepLink(initialUrl);
  //     }
  //   };

  //   getInitialURL();

  //   return () => subscription.remove();
  // }, []);



  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        
        <Stack.Navigator
          initialRouteName="Welcom"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcom" component={Welcom} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registered" component={Registered} />

          <Stack.Screen name="Home" component={BottomTabNavigator} />
         

          
          <Stack.Screen
            name="CategoriesScreen"
            component={CategoriesScreen}
            options={{
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />

          <Stack.Screen
            name="InvoicesScreen"
            component={InvoicesScreen}
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Hóa đơn',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />

          <Stack.Screen

            name="SearchScreen"
            component={SearchScreen}
            options={{
              headerShown: false,
              headerTitleAlign: 'center',
              title: 'Hóa đơn',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
         

<Stack.Screen

            name="MessageScreen"
            component={MessageScreen}
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Liên hệ với chủ shop',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />

          <Stack.Screen
            name="ReviewsScreen"
            component={ReviewsScreen}
            options={{
              headerShown: true,
              title: 'Nhận xét',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          
          <Stack.Screen
            name="StartSearch"
            component={StartSearch}
            options={{
              headerShown: false,
              title: 'Nhận xét',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
        

          <Stack.Screen
            name="CateClother"
            component={CateClother}
            options={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{
              headerShown: true,
              title: 'Giỏ hàng',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{
              headerShown: true,
              title: 'Thanh toán',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
        
       

        
          <Stack.Screen
            name="Favorites"
            component={Favorites}
            options={{
              headerShown: true,
              title: 'Favorites',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />

          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{
              headerShown: true,
              title: 'Notification',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          <Stack.Screen
            name="DetailedOrders"
            component={DetailedOrders}
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Chi tiết đơn hàng',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          
          <Stack.Screen
            name="ProductDetailScreen"
            component={ProductDetailScreen}
            options={{
              headerShown: true,
              title: 'Chi tiết sản phẩm',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          <Stack.Screen
            name="Congrats"
            component={Congrats}
            options={{
              headerShown: false,
              title: 'Congrats',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
         

          <Stack.Screen
            name="AllProductScreen"
            component={AllProductScreen}
            options={{
              headerShown: true,
              title: 'Tất cả sản phẩm',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
         

          <Stack.Screen
            name="ShippingAddressScreen"
            component={ShippingAddressScreen}
            options={{
              headerShown: true,
              title: 'Địa chỉ',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          <Stack.Screen
            name="AddAddress"
            component={AddAddress}
            options={{
              headerShown: true,
              title: 'Thêm Địa chỉ',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
        
          
         
     
          <Stack.Screen
            name="SettingScreen"
            component={SettingScreen}
            options={{
              headerShown: true,
              title: 'Cài đặt',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />

          <Stack.Screen
        
            name="DeliveredOrders"
            component={DeliveredOrders}
            options={{
              headerShown: true,
              title: 'Lịch sử mua hàng',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />
          <Stack.Screen
            name="AddReview"
            component={AddReview}
            options={{
              headerShown: true,
              title: 'Viết đánh giá ',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />

          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{
              headerShown: true,
              title: 'Đặt lại mật khẩu ',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#00A65E', // Màu nền xanh
              },
              headerTintColor: '#fff', // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: 'bold', // Kiểu chữ tiêu đề
              },
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
           
       
    </Provider>
  );
};

export default App;
