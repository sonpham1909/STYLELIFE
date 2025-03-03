import React, {useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import CategoryItem from '../../components/Categories/renderCategory'; // Đổi tên renderCategory thành CategoryItem
import {useDispatch, useSelector} from 'react-redux';
import {fetchSubCategoriesByParent} from '../../redux/actions/actionCategory';
import {useNavigation} from '@react-navigation/native'; // Import hook điều hướng
import StatusView from '../../components/StatusView';

const CategoriesScreen = ({route}) => {
  const {category} = route.params; // Nhận dữ liệu danh mục cha từ route.params
  const dispatch = useDispatch();
  const {subCategories, isLoading,error} = useSelector(state => state.categories);
  
  const navigation = useNavigation(); // Hook điều hướng

  useEffect(() => {
    dispatch(fetchSubCategoriesByParent(category._id)); // Lấy danh mục con khi có category cha
  }, [category._id, dispatch]);

  if (isLoading) {
    return <StatusView isLoading={true} />;
  }

  if (!subCategories || subCategories.length === 0) {
    return <StatusView emptyText="Không có danh muc con nao." />;
  }
  if (error) {
    return <StatusView error={error} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Trang chủ')} // Điều hướng về màn hình Home
        >
          <Image
            source={require('../../assets/images/icon_back.png')} // Đường dẫn tới icon quay lại
            style={styles.backIcon} // Style cho icon
          />
        </TouchableOpacity>

        {/* Hiển thị tên danh mục cha ở giữa */}
        <Text style={styles.categoryNameText}>{category.namecategory}</Text>
      </View>

      <FlatList
        data={subCategories}
        renderItem={({item}) => (
          <CategoryItem
            item={item}
            subCategories={subCategories}
            categoryName={category.namecategory} // Truyền đúng tên danh mục cha
          /> // Truyền danh sách danh mục con vào CategoryItem
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 30, // Đặt kích thước chiều rộng và chiều cao cho nút
    height: 30,
    borderRadius: 20, // Nút hình tròn
    backgroundColor: '#00A65E', // Màu nền đậm giống với ảnh
    justifyContent: 'center', // Canh giữa icon
    alignItems: 'center',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    marginLeft: 10,
    elevation: 5, // Hiệu ứng đổ bóng cho Android
  },
  header: {
    marginVertical: 15,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center', // Căn giữa nội dung trong hàng ngang
  },
  backIcon: {
    width: 20, // Kích thước icon phù hợp
    height: 20,
    tintColor: '#fff', // Màu icon
  },
  categoryNameText: {
    flex: 1, // Cần cho Text để nó chiếm toàn bộ không gian giữa
    textAlign: 'center', // Căn giữa text
    fontSize: 16, // Điều chỉnh kích thước chữ
    fontWeight: 'bold', // Đậm chữ để nổi bật hơn
  },
});

export default CategoriesScreen;
