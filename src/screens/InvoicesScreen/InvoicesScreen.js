import React, { useState, useEffect } from 'react';
import {  StyleSheet, Dimensions, ScrollView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import InvoiceCard from '../../components/Invoices/InvoiceCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByStatus } from '../../redux/actions/actionOder';
import StatusView from '../../components/StatusView';

const initialLayout = { width: Dimensions.get('window').width };

const InvoicesScreen = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.order);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Chờ xác nhận' },
    { key: 'ready_for_shipment', title: 'Đang xử lý' },

    { key: 'shipping', title: 'Đang giao hàng' },

    { key: 'canceled', title: 'Đã hủy' },
    { key: 'delivered', title: 'Thành công' },
    { key: 'waiting_cancel', title: 'Đang chờ hủy' },
  ]);

  // Lấy trạng thái hiện tại dựa trên tab đang chọn
  const currentStatus = routes[index].key;

  // Gọi API lấy danh sách hóa đơn theo trạng thái khi thay đổi tab
  useEffect(() => {
    dispatch(fetchOrdersByStatus(currentStatus));
  }, [currentStatus, dispatch]);

  // Hàm gọi khi hủy đơn hàng thành công để cập nhật danh sách đơn hàng
// Hàm gọi khi hủy đơn hàng thành công để cập nhật danh sách đơn hàng
const handleCancelSuccess = () => {
  dispatch(fetchOrdersByStatus(currentStatus));
};

// Component render cho từng tab
const renderOrderList = () => {
  if (isLoading) {
    return <StatusView isLoading={true} />;
  }

  if (!orders || orders.length === 0) {
    return <StatusView emptyText="Không có đơn hàng nào." />;
  }

  if (error) {
    return <StatusView error={error} />;
  }

  return orders.map((order) => (
<InvoiceCard key={order._id} order={order} onCancelSuccess={handleCancelSuccess} />
  ));
  
};

  // Hàm render scene
  const renderScene = ({ route }) => {
    return (
      <ScrollView style={styles.scene}>
        {renderOrderList()}
      </ScrollView>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={styles.indicator}
          style={styles.tabBar}
          labelStyle={styles.label}
          activeColor="#00A65E"
          inactiveColor="#999"
          scrollEnabled
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  tabBar: {
    backgroundColor: '#FFF',
  },
  indicator: {
    backgroundColor: '#00A65E',
    height: 3,
  },
  label: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default InvoicesScreen;
