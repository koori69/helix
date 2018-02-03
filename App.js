import React from 'react';
import { View, StyleSheet } from 'react-native';
import RootNavigator from './navigation/RootStackNavigator';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <RootNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
