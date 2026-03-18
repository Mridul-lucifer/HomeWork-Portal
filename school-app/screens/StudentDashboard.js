import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, Platform, Alert } from 'react-native';
import { CalendarDays, BookOpen, ClipboardList, CheckCircle2, LogOut, User } from 'lucide-react-native'; 
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const StudentDashboard = ({ navigation }) => {
  const [workData, setWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- 1. SESSION RECOVERY ---
  // If the user refreshes their browser on Mac, we need to ensure they are still authed
  const getAuthData = async () => {
    if (Platform.OS === 'web') {
      return {
        token: localStorage.getItem('userToken'),
        role: localStorage.getItem('userRole'),
      };
    }
    return {
      token: await SecureStore.getItemAsync('userToken'),
      role: await SecureStore.getItemAsync('userRole'),
    };
  };

  // --- 2. FETCH WORK (Memorized with useCallback) ---
  const fetchWork = useCallback(async () => {
    try {
      const { token } = await getAuthData();

      if (!token) {
        navigation.replace('Login');
        return;
      }

      const response = await axios.get(`${API_URL}/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWorkData(response.data);
    } catch (error) {
      // If the token is expired (401), kick them to login
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        console.error("Fetch Error:", error.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchWork();
  }, [fetchWork]);

  // --- 3. LOGOUT LOGIC ---
  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      localStorage.clear();
    } else {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userRole');
    }
    navigation.replace('Login');
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWork();
  };

  const renderItem = ({ item }) => (
    <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border-l-4 border-blue-600">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className={`p-1.5 rounded-lg ${item.type === 'homework' ? 'bg-blue-50' : 'bg-orange-50'}`}>
              {item.type === 'homework' ? 
                <BookOpen size={14} color="#2563eb" /> : 
                <ClipboardList size={14} color="#f97316" />
              }
            </View>
            <Text className={`ml-2 text-[10px] font-bold uppercase tracking-tighter ${item.type === 'homework' ? 'text-blue-600' : 'text-orange-500'}`}>
              {item.type}
            </Text>
          </View>
          <Text className="text-lg font-bold text-slate-900 leading-6">{item.title}</Text>
          <Text className="text-slate-500 mt-2 text-sm leading-5">{item.description || 'Check with your teacher for details.'}</Text>
        </View>
      </View>
      
      <View className="mt-4 pt-4 border-t border-slate-50 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <User size={12} color="#94a3b8" />
          <Text className="text-slate-400 text-[11px] ml-1">Section {item.classSection}</Text>
        </View>
        <CheckCircle2 size={18} color="#22c55e" />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white px-6 pt-14 pb-6 border-b border-slate-100">
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-slate-400 font-semibold text-xs tracking-widest uppercase mb-1">Academy Portal</Text>
            <Text className="text-3xl font-black text-slate-900">Today's Tasks</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="bg-red-50 p-3 rounded-2xl">
            <LogOut color="#ef4444" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-4 text-slate-400 font-medium">Fetching assignments...</Text>
        </View>
      ) : (
        <FlatList
          data={workData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
          }
          ListEmptyComponent={
            <View className="items-center mt-24 px-12">
              <View className="bg-slate-100 p-6 rounded-full mb-4">
                <CalendarDays size={40} color="#94a3b8" />
              </View>
              <Text className="text-slate-800 text-lg font-bold">All caught up!</Text>
              <Text className="text-slate-400 text-center mt-2">No work has been assigned to your section for today yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default StudentDashboard;