import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../../redux/actions/actionUser';

const ResetPasswordScreen = ({ route }) => {
  const { email, otp } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải dài ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await dispatch(resetPassword({ email, otp, newPassword: password })).unwrap();

      setSuccess('Mật khẩu đã được đặt lại thành công');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  }, [route]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Quay lại màn hình đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#34C759',  // Tương tự màu xanh lá đậm
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,  // Hiệu ứng nổi trên Android
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default ResetPasswordScreen;
