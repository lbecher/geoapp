import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, useScrollToTop } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ConnectionContextProvider } from './src/context/connectionContext'
import { LayersContextProvider } from './src/context/layersContext'

import SignIn from './src/screens/SignIn'
import Home from './src/screens/Home'

const Stack = createNativeStackNavigator()

const App = () => {
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
        </SafeAreaProvider>
      </LayersContextProvider>
    </ConnectionContextProvider>
  )
}

export default App