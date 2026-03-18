import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { UserPlus, Users, ShieldCheck, GraduationCap, LogOut } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const AdminDashboard = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher', 
    classSection: ''
  });
  const [loading, setLoading] = useState(false);

  // --- 1. LOGOUT LOGIC ---
  const handleLogout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
      } else {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userRole');
      }
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Error", "Could not log out properly.");
    }
  };

  // --- 2. CREATE USER LOGIC ---
  const handleCreateUser = async () => {
    if (!form.name || !form.email || !form.password) {
      return Alert.alert("Error", "Required fields are missing.");
    }

    setLoading(true);
    try {
      // Get token based on platform
      let token;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }

      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(),
      };

      await axios.post(`${API_URL}/create-user`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Success", `${form.role.toUpperCase()} account created.`);
      setForm({ name: '', email: '', password: '', role: 'teacher', classSection: '' });
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Check your SQL connection or Admin permissions.";
      Alert.alert("Database Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <View className="bg-slate-900 p-8 rounded-b-3xl flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">Admin Panel</Text>
          <Text className="text-slate-400 mt-1">User Management</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="p-2 bg-slate-800 rounded-full">
          <LogOut color="#f87171" size={24} />
        </TouchableOpacity>
      </View>

      <View className="p-6">
        {/* Statistics Cards */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-white p-4 rounded-2xl w-[48%] shadow-sm border border-slate-100">
            <Users color="#6366f1" size={24} />
            <Text className="text-slate-500 mt-2">Teachers</Text>
            <Text className="text-2xl font-bold">Active</Text>
          </View>
          <View className="bg-white p-4 rounded-2xl w-[48%] shadow-sm border border-slate-100">
            <GraduationCap color="#22c55e" size={24} />
            <Text className="text-slate-500 mt-2">Students</Text>
            <Text className="text-2xl font-bold">Database</Text>
          </View>
        </View>

        {/* User Creation Form */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <View className="flex-row items-center mb-6">
            <View className="bg-slate-100 p-2 rounded-lg">
              <UserPlus color="#0f172a" size={20} />
            </View>
            <Text className="text-lg font-bold ml-3 text-slate-800">New Registration</Text>
          </View>

          <View className="space-y-4">
            <TextInput 
              placeholder="Full Name" 
              className="bg-slate-50 p-4 rounded-xl border border-slate-200"
              value={form.name}
              onChangeText={(t) => setForm({...form, name: t})}
            />
            <TextInput 
              placeholder="Email Address" 
              className="bg-slate-50 p-4 rounded-xl border border-slate-200"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => setForm({...form, email: t})}
            />
            <TextInput 
              placeholder="Temporary Password" 
              secureTextEntry
              className="bg-slate-50 p-4 rounded-xl border border-slate-200"
              value={form.password}
              onChangeText={(t) => setForm({...form, password: t})}
            />

            {/* Role Selection */}
            <View className="flex-row bg-slate-100 p-1 rounded-xl">
              <TouchableOpacity 
                onPress={() => setForm({...form, role: 'teacher', classSection: ''})}
                className={`flex-1 p-3 rounded-lg ${form.role === 'teacher' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`text-center font-bold ${form.role === 'teacher' ? 'text-blue-600' : 'text-slate-500'}`}>Teacher</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setForm({...form, role: 'student'})}
                className={`flex-1 p-3 rounded-lg ${form.role === 'student' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`text-center font-bold ${form.role === 'student' ? 'text-blue-600' : 'text-slate-500'}`}>Student</Text>
              </TouchableOpacity>
            </View>

            {form.role === 'student' && (
              <TextInput 
                placeholder="Class (e.g. 10th-B)" 
                className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800"
                value={form.classSection}
                onChangeText={(t) => setForm({...form, classSection: t})}
              />
            )}

            <TouchableOpacity 
              onPress={handleCreateUser}
              disabled={loading}
              className={`p-4 rounded-xl items-center mt-2 ${loading ? 'bg-slate-400' : 'bg-slate-900'}`}
            >
              <Text className="text-white font-bold">
                {loading ? 'Registering...' : 'Register User'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;