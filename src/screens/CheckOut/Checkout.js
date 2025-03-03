import React, {useEffect, useState, useCallback} from 'react';

import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  Alert,
  Linking,

} from 'react-native';
import ShippingInfo from '../../components/Checkout/ShippingInfo';
import PaymentMethod from '../../components/Checkout/PaymentMethod';
import ShippingMethod from '../../components/Checkout/ShippingMethod';
import PriceDetails from '../../components/Checkout/PriceDetails';
import CustomButton from '../../components/Checkout/CustomButton';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchShippingMethods} from '../../redux/actions/actionShipping';
import {fetchPaymentMethods} from '../../redux/actions/actionPayment';
import {fetchCart, deleteAllCartItems} from '../../redux/actions/actionCart';
import {fetchDefaultAddress} from '../../redux/actions/actionAddress';
import {createOrder} from '../../redux/actions/actionOder';
import {initiateMoMoPayment} from '../../redux/actions/actionPaymentMomo';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

  const {
    shippingMethods,
    isLoading: shippingLoading,
    error: shippingError,
  } = useSelector(state => state.shipping);
  const {
    paymentMethods,
    isLoading: paymentLoading,
    error: paymentError,
  } = useSelector(state => state.payment);

  const {cart, isLoading: cartLoading} = useSelector(state => state.cart);
  const {defaultAddress} = useSelector(state => state.addresses);
  const {
    isLoading: momoLoading,
    error: momoError,
  } = useSelector(state => state.payment);

  const totalAmount =
    Array.isArray(cart) && cart.length > 0
      ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;

  useEffect(() => {
    dispatch(fetchShippingMethods());
    dispatch(fetchPaymentMethods());
    dispatch(fetchDefaultAddress());
    dispatch(fetchCart());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDefaultAddress());
    }, [dispatch]),
  );

  const handleOrderPress = () => {
    if (!defaultAddress || !selectedPaymentMethod || !selectedShippingMethod) {
      Alert.alert('Thông báo', 'Vui lòng kiểm tra thông tin giao hàng và thanh toán.');
      return;
    }
  
    if (!cart || cart.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
      return;
    }
  
    // Hiển thị hộp thoại xác nhận
    Alert.alert(
      'Xác nhận đặt hàng',
      `Tổng tiền: ${formattedTotal}\nBạn có chắc chắn muốn đặt hàng không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => confirmAndPlaceOrder(),
        },
      ]
    );
  };
  
  const confirmAndPlaceOrder = () => {
    const orderData = {
      address_id: defaultAddress._id,
      shipping_method_id: selectedShippingMethod,
      payment_method_id: selectedPaymentMethod,
      cartItems: cart,
      total_amount: totalAmount,
    };
  
    dispatch(createOrder(orderData))
      .unwrap()
      .then((orderResponse) => {
        const paymentMethodName = paymentMethods.find(method => method._id === selectedPaymentMethod)?.name;
  
        if (paymentMethodName === 'MoMo') {
          const orderId = orderResponse.order._id;
          dispatch(initiateMoMoPayment({ orderId, amount: totalAmount }))
            .unwrap()
            .then((paymentResponse) => {
              if (paymentResponse.payUrl) {
                console.log('Redirecting to MoMo Payment URL:', paymentResponse.payUrl);
                Linking.openURL(paymentResponse.payUrl).catch(err =>
                  console.error('Failed to open MoMo payment URL:', err),
                );
                // dispatch(deleteAllCartItems());
              }
            })
            .catch((err) => {
              console.error('MoMo payment initiation error:', err);
              Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán MoMo. Vui lòng thử lại.');
            });
        } else {
          Alert.alert(
            'Thành công',
            'Đặt hàng thành công',
            [
              {
                text: 'OK',
                onPress: () => {
                  dispatch(deleteAllCartItems());
                  navigation.navigate('Congrats');
                },
              },
            ],
          );
        }
      })
      .catch((err) => {
        console.error('Order creation error:', err);
        Alert.alert('Lỗi', 'Đặt hàng không thành công. Vui lòng thử lại.');
      });
  };
  
  
  const shippingFee =
    shippingMethods.find(method => method._id === selectedShippingMethod)
      ?.cost || 0;

  const formattedShippingFee = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(shippingFee);

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalAmount + shippingFee);

  const formattedTotalAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalAmount);

  if (shippingLoading || paymentLoading || cartLoading || momoLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (shippingError || paymentError || momoError) {
    return <Text>Error: {shippingError || paymentError || momoError}</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <ShippingInfo
          recipientName={defaultAddress?.recipientName}
          addressDetail={defaultAddress?.addressDetail}
          recipientPhone={defaultAddress?.recipientPhone}
          notes={defaultAddress?.notes}
        />
        <PaymentMethod
          methods={paymentMethods}
          selectedMethod={selectedPaymentMethod}
          onSelectMethod={method => setSelectedPaymentMethod(method)}
        />

        {shippingMethods.length > 0 && (
          <ShippingMethod
            methods={shippingMethods}
            selectedMethod={selectedShippingMethod}
            onSelectMethod={method => setSelectedShippingMethod(method)}
          />
        )}
        <PriceDetails
          price={formattedTotalAmount}
          shippingFee={formattedShippingFee}
          total={formattedTotal}
        />
        <CustomButton title="Đặt hàng" onPress={handleOrderPress} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF',
  },
});

export default CheckoutScreen;
