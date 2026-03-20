import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BookOpen } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '@env';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- 1. SESSION CHECK (Auto-redirect) ---
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        let token, role;
        
        if (Platform.OS === 'web') {
          token = localStorage.getItem('userToken');
          role = localStorage.getItem('userRole');
        } else {
          token = await SecureStore.getItemAsync('userToken');
          role = await SecureStore.getItemAsync('userRole');
        }

        if (token && role) {
          console.log("Existing session found. Redirecting...");
          navigateBasedOnRole(role.toLowerCase().trim());
        }
      } catch (e) {
        console.log("No active session found.");
      }
    };
    checkExistingSession();
  }, []);

  // --- 2. NAVIGATION HELPER (Updated for TabNavigator) ---
  const navigateBasedOnRole = (role) => {
    const normalizedRole = role.toLowerCase().trim();
    
    if (normalizedRole === 'admin') {
      navigation.replace('AdminDashboard');
    } else if (normalizedRole === 'teacher' || normalizedRole === 'student') {
      // Redirect to the 'Main' Stack which holds the TabNavigator
      // We pass the role so the TabNavigator knows which icons to show
      navigation.replace('Main', { userRole: normalizedRole });
    } else {
      Alert.alert("Error", "Role not recognized: " + role);
    }
  };

  // --- 3. LOGIN HANDLER ---
  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please fill all fields");

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim().toLowerCase(),
        password
      });

      const { role, token } = response.data;
      if (!token || !role) throw new Error("Invalid server response");

      const normalizedRole = role.toLowerCase().trim();

      // SAVE DATA (SecureStore for Mobile, localStorage for Web)
      if (Platform.OS === 'web') {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', normalizedRole);
      } else {
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userRole', normalizedRole);
      }

      console.log("Login Success. Role:", normalizedRole);
      navigateBasedOnRole(normalizedRole);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid credentials or network issue.";
      console.log("Login Error:", errorMsg);
      Alert.alert("Login Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <View className="items-center mb-10">
        <View className="bg-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-200">
          <BookOpen color="white" size={40} />
        </View>
        <Text className="text-3xl font-black text-slate-900 tracking-tight">School Portal</Text>
        <Text className="text-slate-500 mt-2 font-medium">Sign in to your account</Text>
      </View>

      <View className="space-y-5">
        <View>
          <Text className="text-slate-700 font-bold mb-2 ml-1">Email Address</Text>
          <TextInput
            className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 focus:border-blue-500"
            placeholder="name@school.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text className="text-slate-700 font-bold mb-2 ml-1">Password</Text>
          <TextInput
            className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 focus:border-blue-500"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-600 p-4 rounded-2xl mt-4 items-center shadow-md shadow-blue-300"
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-12 items-center">
        <View className="bg-slate-100 px-4 py-2 rounded-full">
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Neon SQL Production Linked
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;