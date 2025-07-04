import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBase,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/home';
import Search from './screens/search';
import Hme from './assests/home.png';
import Hmeoutline from './assests/homwwithoutshade.png';
import category from './assests/category.png';
import shopping from './assests/shopping.png';
import Searh from './assests/search.png';
import Cat from './screens/categories';
import Cart from './screens/Cart';
import Product from './screens/Product';
const list = [
  {
    image: require,
    label: 'Home',
  },
  {
    image: require,
    label: 'Settings',
  },
];
const Index = () => {
  list.map(item => console.log(item));
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

       
        tabBarInactiveTintColor: 'black',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused ,color}) => {
          
            return (
              <>
                {focused ? (
                  <Image source={Hme} style={styles.imageStyle} />
                ) : (
                  <Image source={Hmeoutline} style={styles.imageStyle} />
                )}
              </>
            );
          },
        tabBarLabelStyle:{
          color:'red'
        }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => {
            return <Image source={Searh} style={styles.imageStyle} />;
          },
        }}
      />
         <Tab.Screen
        name="Category"
        component={Cat}
        options={{
          tabBarIcon: ({ focused }) => {
            return <Image source={category} style={styles.imageStyle} />;
          },
        }}
      />
        <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ focused }) => {
            return <Image source={shopping} style={styles.imageStyle} />;
          },
        }}
      />
         <Tab.Screen
        name="Product"
        component={Product}
        options={{
 tabBarItemStyle: { display: 'none' },
tabBarStyle: { display: 'none' }
        }}
      />
    </Tab.Navigator>
  );
};

export default Index;

const styles = StyleSheet.create({
  imageStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});
