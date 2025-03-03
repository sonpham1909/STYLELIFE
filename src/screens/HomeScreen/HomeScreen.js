import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, View, ActivityIndicator, Text, RefreshControl } from 'react-native';
import homeStyles from '../../styles/homeStyles';
import ProductList from '../../components/Home/ProductList';
import Banner from '../../components/Home/Banner';
import CategorySection from '../../components/Home/CategorySection';
import { fetchLatestProducts, fetchPopularProducts } from '../../redux/actions/actionProduct';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const latestProducts = useSelector(state => state.products.latestProducts);
  const popularProducts = useSelector(state => state.products.popularProducts);

  // State để theo dõi trạng thái loading và refreshing
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Tải dữ liệu khi màn hình được load lần đầu
  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Hàm tải dữ liệu
  const loadData = async () => {
    setLoading(true); // Bắt đầu tải dữ liệu
    await Promise.all([dispatch(fetchLatestProducts()), dispatch(fetchPopularProducts())]);
    setLoading(false); // Kết thúc tải dữ liệu
  };

  // Hàm gọi khi người dùng kéo để làm mới dữ liệu
  const onRefresh = async () => {
    setRefreshing(true); // Bắt đầu tải lại dữ liệu khi kéo xuống
    await loadData();
    setRefreshing(false); // Kết thúc tải lại dữ liệu
  };

  if (loading) {
    // Nếu đang tải dữ liệu lần đầu, hiển thị ActivityIndicator
    return (
      <View style={[homeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00A65E" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={homeStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00A65E']} />
      }
    >
      {/* Banner Component */}
      <Banner />

      {/* Categories Component */}
      <CategorySection />

      {/* New Products */}
      <ProductList
        navigation={navigation}
        title="Sản Phẩm Mới Nhất"
        products={latestProducts || []}
        horizontal={true}
      />

      {/* Popular Products */}
      <ProductList
        navigation={navigation}
        title="Sản Phẩm Phổ Biến"
        products={popularProducts || []}
        horizontal={true}
      />
    </ScrollView>
  );
};

export default HomeScreen;
