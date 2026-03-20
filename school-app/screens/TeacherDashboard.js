import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { PlusCircle, LayoutDashboard, Send, Search } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown'; // New Import
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';


const TeacherDashboard = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('homework'); 
  const [classSection, setClassSection] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (route.params?.activeType) {
      setType(route.params.activeType);
    }
  }, [route.params?.activeType]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        let token;
        if (Platform.OS === 'web') {
          token = localStorage.getItem('userToken');
        } else {
          token = await SecureStore.getItemAsync('userToken');
        }

        const response = await axios.get(`${API_URL}/get-classes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Format for the dropdown: [{ label: '10-A', value: '10-A' }]
        const formattedClasses = response.data.map(item => ({
          label: item,
          value: item
        }));
        
        setAvailableClasses(formattedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error.message);
      } finally {
        setFetchingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const handleUpload = async () => {
    if (!title || !classSection) {
      return Alert.alert("Missing Info", "Please provide a Title and Select a Class.");
    }

    setLoading(true);
    try {
      let token;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }

      await axios.post(`${API_URL}/upload-work`, {
        title: title.trim(),
        description: description.trim(),
        type,
        classSection: classSection,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Success", `Today's ${type} has been published!`);
      setTitle('');
      setDescription('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Server connection error.";
      Alert.alert("Upload Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className={`px-6 pt-14 pb-8 rounded-b-[40px] shadow-xl ${type === 'homework' ? 'bg-blue-700' : 'bg-orange-600'}`}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-1">Teacher Dashboard</Text>
            <Text className="text-white text-3xl font-black">Post {type === 'homework' ? 'Homework' : 'Classwork'}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 -mt-6 px-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-10">
          
          {/* Searchable Dropdown Container */}
          <View className="mb-6">
            <Text className="text-slate-500 font-bold mb-2 ml-1 text-xs uppercase">Select Target Class</Text>
            {fetchingClasses ? (
              <ActivityIndicator size="small" color="#64748b" />
            ) : (
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: type === 'homework' ? '#2563eb' : '#ea580c' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={availableClasses}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Search Class...' : '...'}
                searchPlaceholder="Type class name..."
                value={classSection}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setClassSection(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <LayoutDashboard color={isFocus ? (type === 'homework' ? '#2563eb' : '#ea580c') : '#64748b'} size={20} style={{marginRight: 10}} />
                )}
              />
            )}
          </View>

          {/* Title Input */}
          <View className="mb-5">
            <Text className="text-slate-500 font-bold mb-2 ml-1 text-xs uppercase">Topic / Title</Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-semibold"
              placeholder="Enter subject and topic..."
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-slate-500 font-bold mb-2 ml-1 text-xs uppercase">Work Details</Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 h-40"
              placeholder="Write instructions for the students here..."
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity 
            onPress={handleUpload}
            disabled={loading}
            activeOpacity={0.8}
            className={`p-5 rounded-2xl flex-row justify-center items-center shadow-lg ${
              loading ? 'bg-slate-300' : (type === 'homework' ? 'bg-blue-600 shadow-blue-200' : 'bg-orange-500 shadow-orange-200')
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-lg mr-2">Publish to {classSection || '...'}</Text>
                <Send color="white" size={20} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles for the Dropdown component (NativeWind doesn't handle inner Dropdown parts well)
const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    borderRadius: 10,
    color: '#0f172a',
  },
});

export default TeacherDashboard;