import React, { Component } from 'react';
import { View, Platform, TextInput } from 'react-native';
import { ButtonGroup, FormLabel, FormInput, Button } from 'react-native-elements';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';

const data = [
    { value: 0, label: '日中', extra: 'jc' },
    { value: 1, label: '中日', extra: 'cj' },
];

export default class DictScreen extends Component {
  static navigationOptions = {
    title: 'Dict',
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(selectedIndex) {
    console.log(selectedIndex);
    this.setState({ selected: selectedIndex });
  }

  onSearch = () => {
    console.log('in onSearch');
    const baseUrl = 'https://dict.hjenglish.com/jp';
    const lang = this.state.selected;
    const word = this.state.word;
    console.log(word);
    const url = `${baseUrl}/${data[lang].extra}/${encodeURI(word)}`;
    console.log(url);
    WebBrowser.openBrowserAsync(url);
  };

  render() {
    const buttons = [];
    data.map(i => i.label).forEach(t => buttons.push(t));
    console.log(buttons);
    const { selected } = this.state;
    return (
      <View>
        <FormLabel>Word</FormLabel>
        <TextInput onChangeText={(word) => { console.log(word); this.setState({ word }); }} />
        <ButtonGroup
          onPress={selectedIndex => this.onChange(selectedIndex)}
          selectedIndex={selected}
          buttons={buttons}
          selectedButtonStyle={{ backgroundColor: 'green' }}
        />
        <Button
          raised
          onPress={this.onSearch}
          title={'Search'}
        />
      </View>
    );
  }
}
