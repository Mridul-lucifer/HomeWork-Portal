import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookOpen, ClipboardList, Image, Settings, PlusSquare } from 'lucide-react-native';

// Import your existing screens
import StudentDashboard from '../../screens/StudentDashboard';
import TeacherDashboard from '../../screens/TeacherDashboard';
import SettingsScreen from '../../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Placeholder screens for Gallery and Settings
const Placeholder = ({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title}</Text>
  </View>
);

const TabNavigator = ({ route }) => {
  // Extract userRole passed from LoginScreen
  const { userRole } = route.params || { userRole: 'student' };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // Blue-700 style
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 1,
          marginBottom: 5,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
        },
      }}
    >
      {userRole === 'teacher' ? (
        // TEACHER TABS
        <>
          <Tab.Screen 
            name="Post HW" 
            component={TeacherDashboard} 
            initialParams={{ activeType: 'homework' }}
            options={{ tabBarIcon: ({ color }) => <PlusSquare color={color} size={24} /> }} 
          />
          <Tab.Screen 
            name="Post CW" 
            component={TeacherDashboard} 
            initialParams={{ activeType: 'classwork' }}
            options={{ tabBarIcon: ({ color }) => <ClipboardList color={color} size={24} /> }} 
          />
          {/* <Tab.Screen 
            name="Gallery" 
            component={Placeholder} 
            options={{ tabBarIcon: ({ color }) => <Image color={color} size={24} /> }} 
          /> */}
        </>
      ) : (
        // STUDENT TABS
        <>
          <Tab.Screen 
            name="Homework" 
            component={StudentDashboard} 
            initialParams={{ filterType: 'homework' }}
            options={{ tabBarIcon: ({ color }) => <BookOpen color={color} size={24} /> }} 
          />
          <Tab.Screen 
            name="Classwork" 
            component={StudentDashboard} 
            initialParams={{ filterType: 'classwork' }}
            options={{ tabBarIcon: ({ color }) => <ClipboardList color={color} size={24} /> }} 
          />
          {/* <Tab.Screen 
            name="Album" 
            component={Placeholder} 
            options={{ tabBarIcon: ({ color }) => <Image color={color} size={24} /> }} 
          /> */}
        </>
      )}
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarIcon: ({ color }) => <Settings color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;