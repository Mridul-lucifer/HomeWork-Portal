import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeWindStyleSheet } from "nativewind";

// 1. Styling Configuration (Essential for Web Support)
NativeWindStyleSheet.setOutput({
  default: "native",
});

// 2. Import Screens
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import TeacherDashboard from './screens/TeacherDashboard';
import StudentDashboard from './screens/StudentDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* The name MUST match navigation.replace('Name') exactly */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}