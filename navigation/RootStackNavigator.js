import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import { TvResultScreen } from '../screens';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
    TvResult: {
      screen: TvResultScreen,
    },
  }, {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  },
  {
    mode: 'card',
  },
);

export default class RootNavigator extends Component {
  render() {
    return (
      <RootStackNavigator />
    );
  }
}
