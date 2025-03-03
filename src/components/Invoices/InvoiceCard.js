import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {cancelOrder} from '../../redux/actions/actionOder';

const InvoiceCard = ({order, onCancelSuccess = () => {}}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [cancelReason, setCancelReason] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false); // State để điều khiển modal xác nhận

  const handleDetailPress = () => {
    navigation.navigate('DetailedOrders', {orderId: order._id});
  };

  const handleCancelPress = () => {
    if (order.status === 'pending') {
      // Hiển thị modal để nhập lý do hủy đơn
      setModalVisible(true);
    } else if (order.status === 'ready_for_shipment') {
      // Hiển thị modal xác nhận yêu cầu hủy đơn
      setConfirmationVisible(true);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelReason) {
      Alert.alert('Lỗi', 'Bạn cần nhập lý do để hủy đơn hàng.');
      return;
    }
    dispatch(cancelOrder({orderId: order._id, cancelReason}))
      .unwrap()
      .then(() => {
        onCancelSuccess(order._id);
      })
      .catch(error => {
        console.error('Error while cancelling the order:', error);
      });
    setModalVisible(false);
    setCancelReason('');
  };

  const handleConfirmProcessingCancel = () => {
    // Xác nhận hủy đơn hàng ở trạng thái "processing"
    dispatch(cancelOrder({orderId: order._id, cancelReason: ''}))
      .unwrap()
      .then(() => {
        onCancelSuccess(order._id);
      })
      .catch(error => {
        console.error('Error while cancelling the order:', error);
      });
    setConfirmationVisible(false);
  };

  return (
    <View style={styles.invoiceCard}>
      <View style={{paddingHorizontal: 20, paddingTop: 20}}>
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceText}>Order {order._id}</Text>
          <Text style={styles.detailText}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={{paddingHorizontal: 40, paddingBottom: 20}}>
        <View style={styles.invoiceDetails}>
          <Text style={styles.detailText}>
            Số lượng:{' '}
            <Text style={styles.invoiceText}>{order.total_products}</Text>
          </Text>
          <Text style={styles.detailText}>
            Tổng tiền:{' '}
            <Text style={styles.boldText}>
              {Number(order.total_amount).toLocaleString('vi-VN')} $
            </Text>
          </Text>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.detailText}>
            Trạng thái thanh toán: <Text style={styles.invoiceText}></Text>
          </Text>
          <Text style={styles.boldText}>
            {order.payment_status === 'pending'
              ? 'Đang chờ xử lý'
              : order.payment_status === 'paid'
              ? 'Đã thanh toán'
              : order.payment_status === 'unpaid'
              ? 'Thanh toán khi \n nhận hàng'
              : order.payment_status === 'failed'
              ? 'Thanh toán thất bại'
              : order.payment_status === 'cancelled'
              ? 'Thanh toán bị từ chối'
              : 'Không xác định'}
          </Text>
        </View>

        <View style={styles.invoiceActions}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={handleDetailPress}>
            <Text style={styles.buttonText}>Chi tiết</Text>
          </TouchableOpacity>
          {(order.status === 'pending' ||
            order.status === 'ready_for_shipment') && (
            <TouchableOpacity onPress={handleCancelPress}>
              <Text style={styles.confirmText}>Hủy đơn</Text>
            </TouchableOpacity>
          )}

          {order.status === 'waiting_cancel' && (
            <Text style={styles.pendingText}>Đang chờ hủy</Text>
          )}
        </View>
      </View>

      {/* Modal nhập lý do hủy */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lý do hủy đơn hàng</Text>
            <TextInput
              style={styles.input}
              value={cancelReason}
              onChangeText={setCancelReason}
              placeholder="Nhập lý do hủy đơn hàng"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmCancel}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận hủy đơn ở trạng thái "processing" */}
      <Modal
        visible={isConfirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yêu cầu hủy đơn hàng</Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmProcessingCancel}>
              <Text style={styles.buttonText}>Yêu cầu hủy đơn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  invoiceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 10,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  invoiceText: {
    fontSize: 16,
    color: '#242424',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#808080',
  },
  boldText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  invoiceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#242424',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmText: {
    color: '#27AE60',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#808080',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default InvoiceCard;
