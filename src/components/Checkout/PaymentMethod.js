import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PaymentMethod = ({ methods, selectedMethod, onSelectMethod }) => {
  useEffect(() => {
    // Chọn phương thức thanh toán đầu tiên mặc định nếu chưa có giá trị được chọn
    if (!selectedMethod && methods.length > 0) {
      onSelectMethod(methods[0]._id);
    }
  }, [methods, selectedMethod, onSelectMethod]);

  const handleValueChange = (value) => {
    onSelectMethod(value);
  };

  const selectedMethodDetails = methods.find(method => method._id === selectedMethod);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức thanh toán</Text>
      <View style={styles.pickerContainer}>
        {selectedMethodDetails?.image && (
          <Image
            source={{ uri: selectedMethodDetails.image }}
            style={styles.methodImage}
          />
        )}
        <Picker
          selectedValue={selectedMethod}
          onValueChange={handleValueChange}
          style={styles.picker}
        >
          {methods
            .filter(method => method.is_active) // Lọc chỉ phương thức đang hoạt động
            .map(method => (
              <Picker.Item key={method._id} label={method.name} value={method._id} />
            ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    color: '#242424',
    marginBottom: 15,
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
    marginLeft: 10,
  },
  methodImage: {
    width: 50,
    height: 50,
  },
});

export default PaymentMethod;
