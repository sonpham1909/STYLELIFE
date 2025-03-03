import React, {useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPurchasedProducts} from '../../redux/actions/actionOder';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {fetchUserReviews} from '../../redux/actions/actionsReview';
import StatusView from '../../components/StatusView';

const DeliveredOrders = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const {purchasedProducts, isLoading, error} = useSelector(
    state => state.order,
  );
  const {userReviews} = useSelector(state => state.reviewResponses);

  // Lấy dữ liệu khi component được mount lần đầu
  useEffect(() => {
    dispatch(fetchPurchasedProducts());
    dispatch(fetchUserReviews());
  }, [dispatch]);

  // Cập nhật lại dữ liệu mỗi khi màn hình lấy nét
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPurchasedProducts());
      dispatch(fetchUserReviews());
    }, [dispatch]),
  );

  // Hàm xử lý làm mới khi kéo
  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([dispatch(fetchPurchasedProducts()), dispatch(fetchUserReviews())])
      .finally(() => setRefreshing(false));
  };

  // Render từng sản phẩm đã mua
  const renderItem = ({item}) => {
    const hasReviewed = userReviews.some(
      review => review.product_id === item.product_id,
    );

    return (
      <View style={styles.productItem}>
        <Image
          source={{
            uri: item.imageVariant !== 'N/A' ? item.imageVariant : null,
          }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {item.productName || 'Sản phẩm không xác định'}
          </Text>
          <Text style={styles.productPrice}>
            {item.productPrice || 'N/A Đ'}
          </Text>
          <Text style={styles.productDetail}>Màu: {item.color}</Text>
          <Text style={styles.productDetail}>Kích cỡ: {item.size}</Text>
        </View>
        {!hasReviewed && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() =>
              navigation.navigate('AddReview', {
                productId: item.product_id,
                color: item.color,
                size: item.size,
                imageVariant: item.imageVariant,
              })
            }>
            <Text style={styles.reviewButtonText}>Viết đánh giá</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return <StatusView isLoading={true} />;
  }

  if (!purchasedProducts || purchasedProducts.length === 0) {
    return <StatusView emptyText="Không có sản phẩm nào đã mua." />;
  }
  if (error) {
    return <StatusView error={error} />;
  }

  return (
    <FlatList
      data={purchasedProducts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.container}
    />
  );
};

export default DeliveredOrders;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#FFF',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#242424',
  },
  productPrice: {
    fontSize: 16,
    color: '#00A65E',
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 14,
    color: '#777',
  },
  reviewButton: {
    backgroundColor: '#00A65E',
    paddingVertical: 8,
    marginTop: 60,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  reviewButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
