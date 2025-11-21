// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './src/store';
import LandingScreen from './src/screens/LandingScreen';
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="AppNavigator" component={AppNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}