import React, { createRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetPasswordRequest, verifyOtpRequest } from '../../redux/actions/actionUser';
import Input from '../../components/Account/Input';
import Button from '../../components/Account/ButtonLogin';
import Container from '../../components/Account/Container';
import FormWrapper from '../../components/Account/FormWrapper';
import globalStyles from '../../styles/globalStyles';
import webSocketService from '../../services/websocket';
import tokenService from '../../services/tokenService';
import { connectSocket, socket } from '../../services/sockerIo';


const LoginScreen = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.user);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  // Xử lý đăng nhập
  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    dispatch(login({ username, password }))

      .unwrap()
      .then(() => {
       tokenService.getUserIdFromToken();
        navigation.replace('Home');
      })
      .catch((error) => {
        Alert.alert('Lỗi đăng nhập', error.message || 'Đăng nhập không thành công');
      });


    const userId = await tokenService.getUserIdFromToken();
    socket.emit('registerUser', userId);
    
    // socket.connect();
  };

  const handleForgotPassword = () => {
    setModalVisible(true);
  };

  const handleSubmitEmail = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Email không được bỏ trống');
      return;
    }

    try {
      setIsLoadingOtp(true); // Bắt đầu trạng thái chờ
      await dispatch(resetPasswordRequest({ email })).unwrap();
      Alert.alert('Thành công', 'Email đặt lại mật khẩu đã được gửi về địa chỉ của bạn.');
      setIsOtpVisible(true); // Hiển thị phần nhập OTP

      // Bắt đầu đếm ngược 60 giây
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer); // Kết thúc đếm ngược
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Gửi email thất bại');
    } finally {
      setIsLoadingOtp(false); // Kết thúc trạng thái chờ
    }
  };


  const MAX_ATTEMPTS = 3;  // Số tối đa thử nhập OTP
  const [otpAttempts, setOtpAttempts] = useState(0);  // Biến lưu số lần nhập OTP

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Lỗi', 'Otp không được bỏ trống');
      return;
    }
    try {
      await dispatch(verifyOtpRequest({ email, otp })).unwrap();

      Alert.alert('Thành công', 'OTP chính xác. Hãy đặt mật khẩu mới.');

      setModalVisible(false);
      navigation.replace('ResetPassword', { email, otp });
      setOtpAttempts(0);  // Reset attempts sau khi nhập thành công
    } catch (error) {
      const updatedAttempts = otpAttempts + 1;
      setOtpAttempts(updatedAttempts);
      setOtp('');
      if (updatedAttempts >= MAX_ATTEMPTS) {
        Alert.alert('Hết giới hạn', 'Bạn đã nhập sai OTP quá 3 lần. Vui lòng yêu cầu OTP mới.');

        setIsOtpVisible(false);  // Tắt modal
      } else {
        Alert.alert('Lỗi', 'Mã OTP không chính xác. Vui lòng thử lại.');
      }
    }
  };


  return (
    <Container>
      <FormWrapper>
        <Text style={globalStyles.heading}>Đăng nhập</Text>

        {/* Ô nhập tên đăng nhập */}
        <Input
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          icon={require('../../assets/images/icon_email.png')}
        />

        {/* Ô nhập mật khẩu */}
        <Input
          placeholder="Mật khẩu"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          icon={require('../../assets/images/icon_password.png')}
        />

        {/* Link Quên mật khẩu */}
        <TouchableOpacity style={globalStyles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={globalStyles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <Button title="Đăng nhập" onPress={handleLogin} isPrimary isLoading={isLoading} />
        <Button title="Đăng ký" onPress={() => navigation.replace('Registered')} isPrimary={false} />

        <Text style={globalStyles.orText}>Hoặc đăng nhập với Google</Text>
        <Image source={require('../../assets/images/icon_google.png')} style={globalStyles.googleIcon} />



        {/* Modal quên mật khẩu */}
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, width: 300, borderRadius: 8 }}>
              <Text style={globalStyles.instructionText}>Nhập email để đặt lại mật khẩu</Text>

              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ borderBottomWidth: 1, marginVertical: 10 }}
              />

              {!isOtpVisible ? (
                <Button
                  title={isLoadingOtp ? "Đang gửi..." : countdown > 0 ? `Gửi lại OTP sau ${countdown}s` : "Gửi OTP"}
                  onPress={handleSubmitEmail}
                  disabled={isLoadingOtp || countdown > 0} // Vô hiệu hóa khi đang gửi hoặc đếm ngược
                />
              ) : (
                <>
                  <TextInput
                    placeholder="Mã OTP"
                    value={otp}
                    onChangeText={setOtp}
                    style={{ borderBottomWidth: 1, marginVertical: 10 }}
                    keyboardType="numeric"
                  />
                  <Button title="Xác nhận" onPress={handleVerifyOtp} />
                </>
              )}


              <Button title="Hủy" onPress={() => {
                setIsOtpVisible(false); // Tắt trạng thái OTP
                setModalVisible(false); setEmail('');     // Reset email
                setOtp('');
              }} />
            </View>
          </View>
        </Modal>
      </FormWrapper>
    </Container>
  );
};

export default LoginScreen;
