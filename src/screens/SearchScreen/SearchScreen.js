import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { searchProduct } from '../../redux/actions/actionProduct';
import ProductList from '../../components/Home/ProductList';
import ProductSearch from '../../components/Home/productSearch';

const SearchScreen = ({route,navigation}) => {

    const dispatch = useDispatch();

    const {isLoadingSearch, productSearch} = useSelector(state => state.products);
  
  const [searchText, setSearchText] = useState('');
  const {searchKeyWord} = route.params;

  useEffect(() => {
    if (searchKeyWord) {
      setSearchText(searchKeyWord);
    }
    loadData();
  }, [dispatch, searchKeyWord]);
  

  const handleBackPress = () => {
    
      navigation.pop(); // Nếu không có text, quay lại màn hình trước
    
  };

  const loadData = async () => {
  
    
    dispatch(searchProduct(searchKeyWord));
     // Kết thúc tải dữ liệu
  };



  if(isLoadingSearch){
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00A65E" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      );
  }

  

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#00A65E"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchKeyWord}
          onChangeText={setSearchText}
          editable={false}// Tự động focus khi mở màn hình tìm kiếm
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color="#999"
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {
        (productSearch && productSearch.length > 0) ? (
            <ProductSearch
            navigation={navigation}
            numCo={2}
            title="Kết quả tìm kiếm"
            products={productSearch || []}
            horizontal={false}
          />
        ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
         
          <Text>Không có sản phẩm bạn muốn tìm</Text>
        </View>
        )
      }
     
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:20,
    alignItems:'center'
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00A65E',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  backIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearIcon: {
    marginLeft: 8,
  },
});
