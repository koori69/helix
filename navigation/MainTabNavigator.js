import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { DictScreen, MovieScreen, TvScreen } from '../screens/';
import Colors from '../constants/Colors';

export default TabNavigator(
  {
    Dict: {
      screen: DictScreen,
    },
    Movie: {
      screen: MovieScreen,
    },
    Tv: {
      screen: TvScreen,
    },
  }, {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Dict':
            iconName = 'dictionary';
            break;
          case 'Movie':
            iconName = 'movie';
            break;
          case 'Tv':
            iconName = 'tv';
            break;
          default:
            iconName = '';
        }
        if (iconName === 'dictionary' || iconName === 'movie') {
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={28}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          );
        } else if (iconName === 'tv') {
          return (
            <Feather
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
