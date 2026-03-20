import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native';
import { LogOut, Palette, ChevronRight, User, ShieldCheck, Info, Moon, Sun } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 1. LOGOUT LOGIC (Fixed for Stack Navigation) ---
  const handleLogout = async () => {
    const performLogout = async () => {
      try {
        if (Platform.OS === 'web') {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userRole');
          // For Web, a hard reload ensures all states are wiped
          window.location.href = '/'; 
        } else {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userRole');
          
          // Resetting the stack ensures the user can't "Go Back"
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } catch (error) {
        Alert.alert("Error", "Could not sign out. Try again.");
      }
    };

    if (Platform.OS === 'web') {
      if (confirm("Are you sure you want to logout?")) performLogout();
    } else {
      Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout }
      ]);
    }
  };

  // --- 2. THEME TOGGLE ---
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    Alert.alert("Theme Updated", `Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode (Visual Preview only)`);
  };

  const SettingItem = ({ icon: Icon, title, onPress, color = "#475569", showChevron = true, value }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center p-5 mb-[1px] active:bg-slate-50 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
      activeOpacity={0.7}
    >
      <View className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} p-2 rounded-lg`}>
        <Icon size={22} color={color} />
      </View>
      <Text className={`flex-1 ml-4 font-semibold text-base ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
        {title}
      </Text>
      {value && <Text className="mr-2 text-slate-400 text-sm">{value}</Text>}
      {showChevron && <ChevronRight size={20} color="#cbd5e1" />}
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-black' : 'bg-slate-100'}`}>
      {/* Header */}
      <View className={`px-6 pt-14 pb-6 border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <Text className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Settings</Text>
      </View>

      <ScrollView className="flex-1 mt-4">
        <Text className="px-6 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Preference</Text>
        <View className={`border-y ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <SettingItem 
            icon={isDarkMode ? Sun : Moon} 
            title="Change Theme" 
            value={isDarkMode ? "Dark" : "Light"}
            onPress={toggleTheme} 
            color={isDarkMode ? "#facc15" : "#2563eb"}
          />
        </View>

        <Text className="px-6 mt-8 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Account & Security</Text>
        <View className={`border-y ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <SettingItem icon={User} title="Edit Profile" onPress={() => {}} />
          <SettingItem icon={ShieldCheck} title="Privacy Policy" onPress={() => {}} />
          <SettingItem icon={Info} title="About App" onPress={() => {}} />
        </View>

        <View className={`mt-10 border-y ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <SettingItem 
            icon={LogOut} 
            title="Logout" 
            onPress={handleLogout} 
            color="#ef4444" 
            showChevron={false}
          />
        </View>

        <Text className="text-center text-slate-400 mt-10 text-xs mb-10">Version 1.0.2 (Production)</Text>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;