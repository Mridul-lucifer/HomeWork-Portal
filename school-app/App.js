import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeWindStyleSheet } from "nativewind";

// 1. Styling Configuration
NativeWindStyleSheet.setOutput({
  default: "native",
});

// 2. Import Screens
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
// Import your new TabNavigator
import TabNavigator from './src/navigation/TabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Tab Flow (Handles Student & Teacher views with Bottom Nav) */}
        <Stack.Screen name="Main" component={TabNavigator} />

        {/* Admin Flow (Usually stays separate from Bottom Nav) */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}