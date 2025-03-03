import React, {useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CartItem from '../../components/Cart/CartItem';
import TotalAmount from '../../components/Cart/TotalAmount';
import CheckoutButton from '../../components/Cart/CheckoutButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteCartItem,
  fetchCart,
  updatequantity,
} from '../../redux/actions/actionCart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StatusView from '../../components/StatusView';

const CartScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {cart, isLoading, error} = useSelector(state => state.cart);

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(fetchCart());
  //   }, [dispatch])
  // );
  
  // Load giỏ hàng khi mở màn hình
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Tính tổng giá trị giỏ hàng
  const calculateTotalAmount = useCallback(() => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;

    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const totalAmount = calculateTotalAmount();

  // Xử lý tăng/giảm số lượng sản phẩm
  // Xử lý tăng/giảm số lượng sản phẩm
  const handleQuantityChange = useCallback(
    (id, action) => {
      const cartItem = cart.find(item => item._id === id);
      if (!cartItem) return;

      let newQuantity =
        action === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;
      newQuantity = Math.max(newQuantity, 1); // Không cho phép số lượng nhỏ hơn 1

      dispatch(updatequantity({cartItemId: id, quantity: newQuantity}))
        .unwrap()
        .catch(error => {
          // Xử lý lỗi từ API
          if (error.message === 'Quantity not available') {
            Alert.alert('Thông báo', 'Số lượng không đủ cho sản phẩm này.');
          } else {
            Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
          }
        });
    },
    [cart, dispatch],
  );

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = useCallback(
    id => {
      dispatch(deleteCartItem(id)).then(() => {
        dispatch(fetchCart());
      });
    },
    [dispatch],
  );

  if (isLoading) {
    return <StatusView isLoading={true} />;
  }
  // Hiển thị thông báo nếu giỏ hàng trống
  if (!cart || cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="cart-off" size={64} color="#B0B0B0" />
        <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
      </View>
    );
  }

  if (error) {
    return <StatusView error={error} />;
  }
  // Render giỏ hàng khi có sản phẩm
  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={({item}) => (
          <CartItem
            item={item}
            onIncrease={() => handleQuantityChange(item._id, 'increase')}
            onDecrease={() => handleQuantityChange(item._id, 'decrease')}
            onRemove={() => handleRemoveItem(item._id)}
            navigation={navigation}
          />
        )}
        keyExtractor={item => item._id.toString()}
      />
      <TotalAmount total={totalAmount} />
      <CheckoutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#B0B0B0',
  },
});

export default CartScreen;
