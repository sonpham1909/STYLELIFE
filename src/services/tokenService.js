import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = 'accessToken';
const TOKEN_EXPIRATION_KEY = 'accessTokenExpiration';

// Lưu token vào AsyncStorage với thời gian hết hạn
const setToken = async (token, expiresIn = 3600) => {
  try {
    const expirationTime = Date.now() + expiresIn * 1000; // Tính thời gian hết hạn (milliseconds)
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(TOKEN_EXPIRATION_KEY, expirationTime.toString());
  } catch (error) {
    console.error('Failed to save the token', error);
  }
};

// Lấy token từ AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const expirationTime = await AsyncStorage.getItem(TOKEN_EXPIRATION_KEY);
    if (token && expirationTime) {
      const currentTime = Date.now();
      if (currentTime < parseInt(expirationTime)) {
        return token;
      } else {
        // Token đã hết hạn, xóa khỏi AsyncStorage
        await removeToken();
        console.error('Token has expired');
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch the token', error);
  }
};

// Xóa token khỏi AsyncStorage
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(TOKEN_EXPIRATION_KEY);
  } catch (error) {
    console.error('Failed to remove the token', error);
  }
};

// Giải mã token để lấy userId
const decodeTokenManually = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to manually decode token:', error);
    return null;
  }
};

// Sử dụng hàm này để giải mã
const getUserIdFromToken = async () => {
  try {
    const token = await getToken();
    if (token) {
      const decodedPayload = decodeTokenManually(token);
      console.log('Decoded Payload:', decodedPayload);

      // Trả về userId từ payload của token (nếu có)
      return decodedPayload.id; // Giả sử `id` được lưu trong payload
    }
    return null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export default {
  setToken,
  getToken,
  removeToken,
  getUserIdFromToken
};
