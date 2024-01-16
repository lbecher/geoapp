import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ConnectionContextProvider } from './src/contexts/ConnectionContext'
import { LayersContextProvider } from './src/contexts/LayersContext'

import Home from './src/Home'
import SignIn from './src/SignIn'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <ConnectionContextProvider>
      <LayersContextProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} >
              <Stack.Screen name='Home' component={Home} />
              <Stack.Screen name='SignIn' component={SignIn} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </LayersContextProvider>
    </ConnectionContextProvider>
  );
}