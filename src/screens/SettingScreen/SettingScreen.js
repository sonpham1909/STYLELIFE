import {StyleSheet, Text, View, TextInput, Switch} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // For pencil icon
import globalStyles from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';

const SettingScreen = () => {
  const navigation = useNavigation(); // For navigation if needed
  const [isSalesEnabled, setIsSalesEnabled] = useState(true); // Default value true to match screenshot
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(false);

  // Handlers for switches
  const toggleSalesSwitch = () =>
    setIsSalesEnabled(previousState => !previousState);
  const toggleBackgroundSwitch = () =>
    setIsBackgroundEnabled(previousState => !previousState);

  return (
    <View style={globalStyles.containerSetting}>
      {/* Header with pencil icon */}

      <View style={styles.header}>
        <Text style={styles.headerText1}>Password</Text>
        <MaterialCommunityIcons name="pencil" size={24} color="#C4C4C4" />
      </View>
      {/* Password Section */}
      <View style={styles.section}>
        <Text style={styles.label}>name</Text>
        <Text style={styles.label1}>*************</Text>
      </View>

      {/* Notification Settings */}
      <Text style={styles.notificationHeader}>Thông Báo</Text>

      {/* Sales Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Sales</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isSalesEnabled ? '#4CAF50' : '#f4f3f4'}
          onValueChange={toggleSalesSwitch}
          value={isSalesEnabled}
        />
      </View>

      {/* Background Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Màu nền</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isBackgroundEnabled ? '#4CAF50' : '#f4f3f4'}
          onValueChange={toggleBackgroundSwitch}
          value={isBackgroundEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: ' #909191',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
  },
  headerText1: {
    color: ' #909191',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow for iOS
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 8, // Shadow for iOS
  },
  label: {
    fontSize: 12,
    color: ' #808080',
    marginBottom: 5,
  },
  label1: {
    fontSize: 14,
    color: '#242424',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  notificationHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  switchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow for iOS
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 8, // Shadow for iOS
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
});

export default SettingScreen;
