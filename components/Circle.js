import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class Circle extends Component {
  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={this.props.onClick}>
          <View style={styles.circleView}>
            <Text style={styles.circleText}>{this.props.text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

Circle.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  circleView: {
    width: 300,
    height: 300,
    backgroundColor: '#986DB2',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderRadius: 150,
  },
  circleText: {
    fontSize: 80,
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
