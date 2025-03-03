import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

const CategoryItem = ({ item, subCategories, categoryName }) => {
  const navigation = useNavigation();

  const handlePressCategory = () => {
    if (!item || !item.name || !item.image) {
      console.error("Danh mục không hợp lệ hoặc thiếu thông tin");
      return;
    }

    navigation.navigate('CateClother', {
      subCategories,
      selectedTabIndex: subCategories.findIndex(sub => sub._id === item._id),
      categoryName
    });
  };

  return (
    <TouchableOpacity style={styles.categoryItem} onPress={handlePressCategory}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
      ) : (
        <Text>No Image</Text>
      )}
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    color: '#000000',
  },
});

export default CategoryItem;
