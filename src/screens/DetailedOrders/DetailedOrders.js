import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchOrderDetails,
  fetchOrderPaymentStatus,
} from '../../redux/actions/actionOder';
import {useRoute} from '@react-navigation/native';
import StatusView from '../../components/StatusView';

const DetailedOrders = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const {orderId} = route.params;

  const {
    orderDetails,
    paymentStatus,
    isLoadingOrderDetails,
    isLoadingPaymentStatus,
    error,
  } = useSelector(state => state.order);

  // Tính tổng tiền của các item trong đơn hàng
  const totalAmount = orderDetails.items
    ? orderDetails.items.reduce((acc, item) => acc + item.total_amount, 0)
    : 0;

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
      dispatch(fetchOrderPaymentStatus(orderId)); // Thêm dòng này để gọi thông tin thanh toán
    }
  }, [dispatch, orderId]);

  if (isLoadingOrderDetails || isLoadingPaymentStatus) {
    return <StatusView isLoading={true} />;
  }

  if (!orderDetails || orderDetails.length === 0) {
    return <StatusView emptyText="Không có sản phẩm nào đã mua." />;
  }
  if (error) {
    return <StatusView error={error} />;
  }

  const formatAddress = addressDetail => {
    if (!addressDetail) return 'Chưa có địa chỉ';
    const {street, ward, district, city} = addressDetail;
    return [street, ward, district, city].filter(Boolean).join(', ');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng: </Text>
        <Text style={styles.headerDate}>
          {orderDetails?.order?.createdAt
            ? new Date(orderDetails.order.createdAt).toLocaleDateString('vi-VN')
            : 'Chưa xác định'}
        </Text>
      </View>

      {/* Hàng hóa */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={20}
            color="#00A65E"
          />
          <Text style={styles.sectionTitle}>Hàng hóa</Text>
        </View>

        {/* Danh sách sản phẩm */}
        <View style={styles.groupedProducts}>
          {orderDetails?.items?.length > 0 ? (
            orderDetails.items.map((item, index) => {
              const product = item.product_id; // Lấy thông tin sản phẩm từ item
              return (
                <View style={styles.productItem} key={index}>
                  <Image
                    source={{
                      uri: item.image_variant || product?.imageUrls?.[0],
                    }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {index + 1}. Sản phẩm: {product?.name || 'N/A'}
                    </Text>
                    <Text style={styles.productColor}>
                      Màu sắc: {item.color || 'N/A'}
                      {' || '}
                      Size : {item.size}
                    </Text>
                    <Text style={styles.productPrice}>
                      {item.quantity} x{' '}
                      {Number(item.price).toLocaleString('vi-VN')} Đ ={' '}
                      {Number(item.total_amount).toLocaleString('vi-VN')} Đ
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text>Không có sản phẩm nào.</Text>
          )}
        </View>

        {/* Tổng tiền của đơn hàng */}
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmountText}>
            Tổng giá trị đơn hàng:{' '}
            {totalAmount ? totalAmount.toLocaleString('vi-VN') : 'N/A'} Đ
          </Text>
        </View>
      </View>

      {/* Khách hàng */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="account-outline"
            size={20}
            color="#00A65E"
          />
          <Text style={styles.sectionTitle}>Khách hàng</Text>
        </View>
        <View style={styles.customerInfo}>
          <View style={styles.customerRow}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color="#00A65E"
            />
            <Text style={styles.customerText}>
              {orderDetails?.order?.recipientName || 'Không có tên người nhận'}
            </Text>
          </View>
          <View style={styles.customerRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#00A65E" />
            <Text style={styles.customerText}>
              {orderDetails?.order?.recipientPhone || 'Không có số điện thoại'}
            </Text>
          </View>
          <View style={styles.customerRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#00A65E"
            />
            <Text style={styles.customerText}>
              {formatAddress(orderDetails?.order?.addressDetail)}
            </Text>
          </View>
        </View>
      </View>

      {/* Thanh toán */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={20}
            color="#00A65E"
          />
          <Text style={styles.sectionTitle}>Thanh toán</Text>
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentText}>
            Method:{' '}
            {orderDetails?.order?.payment_method_id?.name || 'Chưa xác định'}
          </Text>

          {paymentStatus?.paymentMethod === 'MoMo' && (
            <Text style={styles.paymentText}>
              Trạng thái:{' '}
              {paymentStatus?.paymentStatus === 'paid'
                ? 'Đã thanh toán'
                : paymentStatus?.paymentStatus === 'pending'
                ? 'Đang chờ thanh toán'
                : paymentStatus?.paymentStatus === 'cancelled'
                ? 'Giao dịch bị hủy'
                : paymentStatus?.paymentStatus === 'failed'
                ? 'Giao dịch thất bại'
                : paymentStatus?.paymentStatus === 'expired'
                ? 'Giao dịch hết hạn'
                : 'Trạng thái không xác định'}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  totalAmountContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#242424',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerDate: {
    fontSize: 16,
    color: '#999',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  groupedProducts: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Căn top cho phần hình ảnh và thông tin sản phẩm
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 5,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productColor: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242424',
  },
  customerInfo: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  customerText: {
    fontSize: 16,
    marginLeft: 5,
  },
  paymentInfo: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  paymentText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DetailedOrders;
