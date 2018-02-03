import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DictScreen from '../screens/DictScreen';
import Colors from '../constants/Colors';

export default TabNavigator(
  {
    Dict: {
      screen: DictScreen,
    },
  }, {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName =
                            Platform.OS === 'ios'
                                ? `ios-information-circle${focused ? '' : '-outline'}`
                                : 'md-information-circle';
            break;
          case 'Links':
            iconName = Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link';
            break;
          case 'Settings':
            iconName =
                            Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options';
            break;
          case 'Dict':
            iconName = 'dictionary';
            break;
          default:
            iconName = '';
        }
        if (iconName === 'dictionary') {
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={28}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          );
        } else {
          return (
            <Ionicons
              name={iconName}
              size={28}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          );
        }
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  },
);
