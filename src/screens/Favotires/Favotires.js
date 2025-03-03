// screens/Favorites.js
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavoriteList, toggleFavorite } from '../../redux/actions/actionFavorite';
import FavoriteItem from '../../components/Favotires/ProductItem';
import StatusView from '../../components/StatusView';

const Favorites = ({ navigation }) => {
  const dispatch = useDispatch();
  const {favoriteList,isLoading,error} = useSelector(state => state.favorites);

 
  useEffect(() => {
    dispatch(fetchFavoriteList());
  }, [dispatch]);

  const handleToggleFavorite = (productId) => {
    dispatch(toggleFavorite(productId));
  };

  if (isLoading) {
    return <StatusView isLoading={true} />;
  }

  if (!favoriteList || favoriteList.length === 0) {
    return <StatusView emptyText="Không có yeu thich nao." />;
  }
  if (error) {
    return <StatusView error={error} />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteList}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <FavoriteItem
            product={item}
            onToggleFavorite={() => handleToggleFavorite(item._id)}
            navigation={navigation} // Truyền navigation vào FavoriteItem
          />
        )}
        style={styles.list}
      />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
