import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { PlusCircle, BookOpen, ClipboardList, LogOut, LayoutDashboard } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const TeacherDashboard = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('homework'); 
  const [classSection, setClassSection] = useState('');
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
      Alert.alert("Error", "Logout failed.");
    }
  };

  // --- 2. UPLOAD WORK LOGIC ---
  const handleUpload = async () => {
    if (!title || !classSection) {
      return Alert.alert("Required", "Please enter Title and Class Section");
    }

    setLoading(true);
    try {
      // Get token based on platform (MacBook vs Mobile)
      let token;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }

      // POST request with Authorization Header
      await axios.post(`${API_URL}/upload-work`, {
        title: title.trim(),
        description: description.trim(),
        type,
        classSection: classSection.trim().toUpperCase(),
      }, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      Alert.alert("Success", `${type.toUpperCase()} posted successfully!`);
      setTitle('');
      setDescription('');
      setClassSection('');
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to upload to database.";
      Alert.alert("Upload Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-slate-50" 
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Header Area */}
      <View className="bg-blue-700 p-8 rounded-b-3xl shadow-lg flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">Teacher Portal</Text>
          <Text className="text-blue-100 mt-1">Manage Daily Updates</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="bg-blue-800 p-3 rounded-full">
          <LogOut color="white" size={22} />
        </TouchableOpacity>
      </View>

      <View className="p-6">
        {/* Class Input */}
        <View className="mb-4">
          <Text className="text-slate-600 font-bold mb-2">Target Class (e.g., 10-A)</Text>
          <TextInput
            className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-slate-900"
            placeholder="Enter Class & Section"
            value={classSection}
            onChangeText={setClassSection}
            autoCapitalize="characters"
          />
        </View>

        {/* Type Toggle Buttons */}
        <View className="flex-row mb-6 justify-between">
          <TouchableOpacity 
            onPress={() => setType('homework')}
            className={`w-[48%] flex-row justify-center items-center p-4 rounded-xl shadow-sm ${type === 'homework' ? 'bg-blue-600' : 'bg-white border border-slate-200'}`}
          >
            <BookOpen color={type === 'homework' ? 'white' : '#475569'} size={20} />
            <Text className={`ml-2 font-bold ${type === 'homework' ? 'text-white' : 'text-slate-600'}`}>Homework</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setType('classwork')}
            className={`w-[48%] flex-row justify-center items-center p-4 rounded-xl shadow-sm ${type === 'classwork' ? 'bg-orange-500' : 'bg-white border border-slate-200'}`}
          >
            <ClipboardList color={type === 'classwork' ? 'white' : '#475569'} size={20} />
            <Text className={`ml-2 font-bold ${type === 'classwork' ? 'text-white' : 'text-slate-600'}`}>Classwork</Text>
          </TouchableOpacity>
        </View>

        {/* Form Container */}
        <View className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <View className="flex-row items-center mb-4">
            <LayoutDashboard size={20} color="#1d4ed8" />
            <Text className="text-slate-800 font-bold text-lg ml-2">Post Content</Text>
          </View>

          <Text className="text-slate-500 font-semibold mb-1">Topic Title</Text>
          <TextInput
            className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-4 text-slate-900"
            placeholder="e.g., Photosynthesis Chapter 4"
            value={title}
            onChangeText={setTitle}
          />

          <Text className="text-slate-500 font-semibold mb-1">Instructions</Text>
          <TextInput
            className="bg-slate-50 border border-slate-100 p-4 rounded-xl h-40 text-slate-900"
            placeholder="Provide details about the task..."
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity 
            onPress={handleUpload}
            disabled={loading}
            className={`mt-6 p-4 rounded-xl flex-row justify-center items-center ${loading ? 'bg-slate-400' : 'bg-blue-700'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <PlusCircle color="white" size={24} />
                <Text className="text-white font-bold text-lg ml-2">Publish Update</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TeacherDashboard;