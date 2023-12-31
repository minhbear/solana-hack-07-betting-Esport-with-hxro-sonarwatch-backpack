import { registerRootComponent } from 'expo';
import { RecoilRoot } from 'recoil';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { useFonts, Inter_900Black } from '@expo-google-fonts/dev';
import { PredictingScreens } from './screens/PredictingScreen';
import { HomeScreen, TokenInfoChartNavigator } from './screens/HomeNavigator';
import { ChartEsportcast } from './screens/ChartEsportcast'
import { TokenListNavigator } from './screens/TokenNavigator';
import { AntDesign, Ionicons } from '@expo/vector-icons'; 
import { PersonalScreen } from './screens/PersonalScreen'

import XnftContextProvider, {
  IFRAME_ORIGIN,
  useXnft,
} from './provider/XnftProvider';
import tw from 'twrnc';
import { useTheme } from './hooks/useTheme';
import { HistoryNavigator} from './screens/History';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
    
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Home"
        component={TokenInfoChartNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: "#161723",
          },
          headerTitleStyle: {
            color: "white",
            // Add other title style properties as needed
          },
          tabBarStyle: {
            backgroundColor: '#161723',
            // Other tabBar style properties
          },
        }}
      />
      {/* <Tab.Screen
        name="Chart Esport Forecast"
        component={ChartEsportcast}
        options={{
          tabBarLabel: 'Chart Esport Forecast',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: "#161723",
          },
          headerTitleStyle: {
            color: "white",
            // Add other title style properties as needed
          },
          tabBarStyle: {
            backgroundColor: '#161723',
            // Other tabBar style properties
          },
        }}
      /> */}
      <Tab.Screen
        name="List"
        component={TokenListNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Predicting battles',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bank" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: "#161723",
          },
          headerTitleStyle: {
            color: "white",

            borderBottomWidth: 0,
          },
          tabBarStyle: {
            backgroundColor: '#161723',
            borderTopWidth: 0,
            // Other tabBar style properties
          },
        }}
      />
      <Tab.Screen
        name="Personal"
        component={PersonalScreen}
        options={{
          tabBarLabel: 'Personal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: "#161723",
          },
          headerTitleStyle: {
            color: "white",
            // Add other title style properties as needed
          },
          tabBarStyle: {
            backgroundColor: '#161723',
            // Other tabBar style properties
          },
          tabBarLabelStyle: {
            fontSize: 14,
            // Other tabBarLabel style properties
          },
          tabBarIconStyle: {
            // Styling for tabBarIcon
          },
        }}
      />
          <Tab.Screen
        name="History"
        component={HistoryNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: "#161723",
          },
          headerTitleStyle: {
            color: "white",

            borderBottomWidth: 0,
          },
          tabBarStyle: {
            backgroundColor: '#161723',
            borderTopWidth: 0,
            // Other tabBar style properties
          },
        }}
      />
    </Tab.Navigator>
  );
}
function Iframe() {
  const { setAppIframeElement } = useXnft();

  return (
    <iframe
      allow={`fullscreen;clipboard-write ${IFRAME_ORIGIN}`}
      // sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
      src={IFRAME_ORIGIN}
      style={tw`border-0 w-full h-full`}
      ref={(node) => {
        if (node) {
          setAppIframeElement(node);
        }
      }}
    />
  );
}
function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <XnftContextProvider>
      <RecoilRoot>
        <NavigationContainer>
          <TabNavigator
          ></TabNavigator>
        </NavigationContainer>
      </RecoilRoot>
    </XnftContextProvider>
  );
}

export default registerRootComponent(App);
