import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const saveAuthData = async (token, role) => {
  const normalizedRole = role.toLowerCase().trim();
  if (Platform.OS === 'web') {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', normalizedRole);
  } else {
    // Await both to ensure iOS Keychain is updated before proceeding
    await Promise.all([
      SecureStore.setItemAsync('userToken', token),
      SecureStore.setItemAsync('userRole', normalizedRole),
    ]);
  }
};

export const getAuthData = async () => {
  if (Platform.OS === 'web') {
    return {
      token: localStorage.getItem('userToken'),
      role: localStorage.getItem('userRole'),
    };
  }
  const [token, role] = await Promise.all([
    SecureStore.getItemAsync('userToken'),
    SecureStore.getItemAsync('userRole'),
  ]);
  return { token, role };
};