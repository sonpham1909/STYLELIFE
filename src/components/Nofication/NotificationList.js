import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications }) => {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

export default NotificationList;
