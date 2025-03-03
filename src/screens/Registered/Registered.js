import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Modal, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, sendOTPtoEmail } from '../../redux/actions/actionUser'; // Import action register
import Input from '../../components/Account/Input';
import Button from '../../components/Account/ButtonLogin';
import Container from '../../components/Account/Container';
import FormWrapper from '../../components/Account/FormWrapper';
import globalStyles from '../../styles/globalStyles';

const Registered = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [fullName, setFullName] = useState('');  // Thêm trường full_name
  const [phoneNumber, setPhoneNumber] = useState('');  // Thêm trường phone_number
  const [isVisitableOTP, setIsVisitableOTP] = useState(false);
  const dispatch = useDispatch();
  const { error, isLoading, userInfo, message } = useSelector(state => state.user);
  const handleRegister = () => {
    if (username.length < 6) {
      Alert.alert('Lỗi', 'Tên người dùng phải có ít nhất 6 ký tự.');
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert('Lỗi', 'Số điện thoại phải có ít nhất 10 ký tự.');
      return;
    }

    if (!username || !email || !password || password !== rePassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin và kiểm tra lại mật khẩu');
      return;
    }

    dispatch(sendOTPtoEmail(email))
      .unwrap()
      .then(() => {

        setIsVisitableOTP(true);
      })
      .catch((error) => {
        console.error("Đăng ký không thành công:", error);  // Log lỗi chi tiết từ Redux
        Alert.alert('Lỗi', error || 'Đăng ký không thành công');
      });


  };
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    dispatch(register({ username, email, password, full_name: fullName, phone_number: phoneNumber, code: otp }))
      .unwrap()
      .then(() => {
        Alert.alert('Thành công', 'Đăng ký thành công');
        navigation.replace('Login');
      })
      .catch((error) => {
       console.log(error);
       
        Alert.alert( error.message );
      });
  };

  const handleOnclose = () => {
    setIsVisitableOTP(false)
  }





  return (
    <Container>
      <FormWrapper>
        <Text style={globalStyles.heading}>Đăng ký</Text>

        {/* Ô nhập User Name */}
        <Input
          placeholder="User Name"
          value={username}
          onChangeText={text => setUsername(text)}
          icon={require('../../assets/images/icon_email.png')}
        />

        {/* Ô nhập Email */}
        <Input
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          icon={require('../../assets/images/icon_email.png')}
        />

        {/* Ô nhập Full Name */}
        <Input
          placeholder="Full Name"
          value={fullName}
          onChangeText={text => setFullName(text)}  // Ô nhập tên đầy đủ
          icon={require('../../assets/images/icon_email.png')}
        />

        {/* Ô nhập Phone Number */}
        <Input
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}  // Ô nhập số điện thoại
          icon={require('../../assets/images/icon_email.png')}
        />

        {/* Ô nhập Password */}
        <Input
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
          icon={require('../../assets/images/icon_password.png')}
        />

        {/* Ô nhập Re-Password */}
        <Input
          placeholder="Re-Password"
          secureTextEntry={true}
          value={rePassword}
          onChangeText={text => setRePassword(text)}
          icon={require('../../assets/images/icon_password.png')}
        />

        {/* Nút đăng ký */}
        <Button title="Đăng ký" onPress={handleRegister} isPrimary={true} />
        <Button title="Đăng nhập" onPress={() => navigation.replace('Login')} isPrimary={false} />

        {/* Đăng nhập với Google */}
        <Text style={globalStyles.orText}>Hoặc đăng ký với Google</Text>
        <Image
          source={require('../../assets/images/icon_google.png')}
          style={globalStyles.googleIcon}
        />
      </FormWrapper>

      <Modal
        visible={isVisitableOTP}
        transparent={true}
        animationType="slide"
        onRequestClose={handleOnclose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã OTP đã gửi đến email của bạn</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="Nhập mã OTP"
              keyboardType="numeric"
              maxLength={6} // Giới hạn số ký tự
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleOnclose}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>

    </Container>
  );
};

export default Registered;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#808080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
