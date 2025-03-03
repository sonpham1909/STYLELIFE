import {StyleSheet, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import colors from '../../constants/colors';
import CardProfile from '../../components/ShippingAddress/CardProfile';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserInfoVS1} from '../../redux/actions/actionUser';
import {fetchAllAddresses} from '../../redux/actions/actionAddress'; // Import action để lấy danh sách địa chỉ
import {fetchUserReviews} from '../../redux/actions/actionsReview'; // Import action để lấy danh sách địa chỉ
import {fetchPurchasedProducts,fetchOrders} from '../../redux/actions/actionOder'; // Import action để lấy danh sách địa chỉ

const Personal = () => {
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState(null);

  // Sử dụng useSelector để lấy thông tin người dùng và địa chỉ từ Redux store
  const userInfovs1 = useSelector(state => state.user.userInfovs1);
  const addressesList = useSelector(state => state.addresses.addressesList); // Lấy danh sách địa chỉ từ store
  const userReviews = useSelector((state) => state.reviewResponses.userReviews);
  const  purchasedProducts= useSelector((state) => state.order.purchasedProducts);
  const  oderTotal= useSelector((state) => state.order.oderTotal);

  // Lấy thông tin người dùng từ userInfovs1.user
  const user = userInfovs1?.user;

  // Load thông tin người dùng và danh sách địa chỉ khi mở màn hình
  useEffect(() => {
    dispatch(fetchUserInfoVS1());
    dispatch(fetchAllAddresses());
    dispatch(fetchPurchasedProducts());
    dispatch(fetchUserReviews());
    dispatch(fetchOrders());

    // Lấy danh sách địa chỉ khi mở màn hình
    // Lấy danh sách địa chỉ khi mở màn hình
  }, [dispatch]);

  // Điều hướng
  const navigation = useNavigation();

  const [orders, setOrders] = useState([
    {id: '1', name: 'Order 1'},
    {id: '2', name: 'Order 2'},
    // ...
  ]);

  const [reviews, setReviews] = useState([
    {id: '1', review: 'Review 1'},
    {id: '2', review: 'Review 2'},
    // ...
  ]);

  const chooseImage = () => {
    let options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Người dùng không chọn ảnh');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = {uri: response.assets[0].uri};
        setAvatar(source);
      }
    });
  };

  return (
   <ScrollView>
     <View style={styles.container}>
      <View style={styles.info}>
        <TouchableOpacity style={styles.boxAvatar} onPress={chooseImage}>
          {avatar ? (
            <Image source={avatar} style={styles.avatar} />
          ) : (// Sử dụng ảnh avatar từ Redux nếu có, nếu không sẽ hiển thị ảnh mặc định
            <Image
              source={
                user?.avatar
                  ? {uri: user.avatar}
                  : require('../../assets/images/icon_avatar.png')
              }
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>
        <View>
          {/* Hiển thị tên và email từ Redux */}
          <Text style={styles.text}>
            {user?.full_name || 'Tên không xác định'}
          </Text>
          <Text style={styles.email}>
            {user?.email || 'Email không xác định'}
          </Text>
        </View>
      </View>

      {/* CardProfile component */}
      <CardProfile
        title={'Đơn hàng của tôi'}
        onpress={() => {
          navigation.navigate('InvoicesScreen');
        }}
        preview={'Đã có ' + oderTotal.length + ' đơn hàng'}
      />
      <CardProfile
        title={'Địa chỉ giao hàng'}
        onpress={() => {
          navigation.navigate('ShippingAddressScreen');
        }}
        preview={addressesList.length + ' Địa chỉ'} // Hiển thị tổng số địa chỉ từ Redux
      />
      <CardProfile
        title={'Đánh giá của tôi'}
        onpress={() => {
          navigation.navigate('ReviewsScreen');
        }}
        preview={'Đã đánh giá ' + userReviews.length + ' mục'}
      />
       <CardProfile
        title={'Lịch sử mua hàng'}
        onpress={() => {
          navigation.navigate('DeliveredOrders');
        }}
        preview={'Đã mua ' + purchasedProducts.length + ' sản phẩm'}
      />
       <CardProfile
        title={'Liên hệ với chủ shop'}
        onpress={() => {
          navigation.navigate('MessageScreen');
        }}
       
      />
      <CardProfile
        title={'Cài đặt'}
        onpress={() => {
          navigation.navigate('SettingScreen');
        }}
        preview={'Thông báo, Mật khẩu, FAQ, Liên hệ'}
      />
    </View>
   </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginRight: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxAvatar: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: colors.border,
  },
});

export default Personal;