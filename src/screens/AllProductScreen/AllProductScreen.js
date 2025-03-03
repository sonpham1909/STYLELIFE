
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ProductList from '../../components/AllProduct/ProductList';
import handleProductPress from '../../components/AllProduct/handleProductPress';
import FilterSection from '../../components/AllProduct/FilterSection'; // Nhập FilterSection

const newProducts = [
    { 
        id: '1', 
        name: 'Áo Thun Cổ Tròn Nam', 
        price: '250,000', 
        image: require('../../assets/images/item_1.png'), 
        rating: 4,
        ratingCount: 17, 

        colors: ['#FF0000', '#00FF00', '#0000FF'], // Các màu sắc có sẵn
        size: 'M' 
    },
    { 
        id: '2', 
        name: 'Áo Sơ Mi Dài Tay', 
        price: '600,000', 
        image: require('../../assets/images/item_2.png'), 
        rating: 5,
        ratingCount: 17, 
        colors: ['#FFFFFF', '#000000'], 
        size: 'L' 
    },
    { 
        id: '', 
        name: 'Áo Sơ Mi Dài Tay', 
        price: '600,000', 
        image: require('../../assets/images/item_2.png'), 
        rating: 5,
        ratingCount: 17, 

        colors: ['#FFFFFF', '#000000'], 
        size: 'L' 
    },
    { 
        id: '3', 
        name: 'Quần Jean Nam', 
        price: '700,000', 
        image: require('../../assets/images/item_3.png'), 
        rating: 4,
        ratingCount: 17, 
        colors: ['#1E90FF', '#A52A2A'], 
        size: '32' 
    },
    { 
        id: '4', 
        name: 'Áo Khoác Hoodie', 
        price: '550,000', 
        image: require('../../assets/images/item_4_1.png'), 
        rating: 3,
        ratingCount: 17, 
        colors: ['#FF6347', '#FFD700'], 
        size: 'XL' 
    },
    { 
        id: '9', 
        name: 'Áo Khoác Hoodie', 
        price: '550,000', 
        image: require('../../assets/images/item_4_1.png'), 
        rating: 3,
        ratingCount: 17, 
        colors: ['#FF6347', '#FFD700'], 
        size: 'XL' 
    },
];




const AllProductScreen = ({navigation}) => {
    const [selectedSize, setSelectedSize] = useState('All');
    const [selectedColor, setSelectedColor] = useState('All');
    const [selectedPrice, setSelectedPrice] = useState('All');
   
    return (
        <View >
        {/* Filter Section */}
        <FilterSection 

            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
        />
            <ProductList navigation={navigation } products={newProducts} onProductPress={handleProductPress} />
    </View>
    );
};

export default AllProductScreen
