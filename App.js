import React from 'react';
import Home from './src/screens/Home';
import Splash from './src/screens/Splash';
import Done from './src/screens/Done';
import TaskScreen from './src/screens/Task';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {Store} from './src/redux/store';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#49E102',
        tabBarInactiveTintColor: '#555',
        tabBarInactiveBackgroundColor: '#f1f1f1',
        tabBarActiveBackgroundColor: '#E9FCDF',
      }}
      initialRouteName="To-Do">
      <Tab.Screen
        name="To-Do"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name={'clipboard-list'} size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={'Done'}
        component={Done}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="clipboard-check" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const RootStack = createStackNavigator();

function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#49E102',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
            },
          }}>
          <RootStack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Task" component={TaskScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
