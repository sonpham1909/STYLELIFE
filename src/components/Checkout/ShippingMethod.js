import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ShippingMethod = ({ methods, selectedMethod, onSelectMethod }) => {
  useEffect(() => {
    if (methods.length > 0 && !selectedMethod) {
      onSelectMethod(methods[0]._id);
    }
  }, [methods, selectedMethod, onSelectMethod]);
  

  const renderPickerItems = () =>
    methods.map((method) => (
      <Picker.Item
        key={method._id}
        label={`${method.name} (${method.estimatedDeliveryTime})`}
        value={method._id}
      />
    ));

  const selectedMethodDetails = methods.find(
    (method) => method._id === selectedMethod
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Phương thức giao hàng</Text>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.pickerContainer}>
          {selectedMethodDetails && (
            <Image
              source={
                selectedMethodDetails.image
                  ? { uri: selectedMethodDetails.image }
                  : require('../../assets/images/icon_ghtk.png') // Ảnh mặc định nếu không có ảnh
              }
              style={styles.methodIcon}
            />
          )}
          <Picker
            selectedValue={selectedMethod}
            onValueChange={(itemValue) => onSelectMethod(itemValue)}
            style={styles.picker}
          >
            {renderPickerItems()}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    color: '#242424',
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginLeft: 8,
  },
  picker: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 10,
  },
  methodIcon: {
    width: 50,
    height: 30,
  },
});

export default ShippingMethod;
