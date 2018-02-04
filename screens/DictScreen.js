import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { InputItem, Radio, List, WhiteSpace, Tag, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Ionicons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';

const RadioItem = Radio.RadioItem;
const data = [
    { value: 0, label: '沪江小D-日中', extra: 'jc' },
    { value: 1, label: '沪江小D-中日', extra: 'cj' },
];

class Dict extends Component {
  static navigationOptions = {
    title: 'Dict',
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
    // this.onChange = this.onChange.bind(this);
    // this.onSearch = this.onSearch(this);
  }

  onChange(value) {
    console.log(value);
    this.setState({ selected: value });
  }

  onSearch() {
    const baseUrl = 'https://dict.hjenglish.com/jp';
    const lang = this.state.selected;
    const word = this.props.form.getFieldValue('word');
    const url = `${baseUrl}/${data[lang].extra}/${encodeURI(word)}`;
    console.log(url);
    WebBrowser.openBrowserAsync(url);
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <View>
        <List>
          <InputItem
            {...getFieldProps('word')}
            placeholder={'search word'}
          >Word:
          </InputItem>
          <WhiteSpace />
          {
                data.map(i => (
                  <RadioItem
                    key={i.value}
                    checked={this.state.selected === i.value}
                    onChange={() => this.onChange(i.value)}
                  >
                    {i.label}
                  </RadioItem>
                ))
            }
          <Button type="primary" onClick={() => this.onSearch()}>
              Search
            <Ionicons name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} size={26} />
          </Button>
        </List>
      </View>
    );
  }
}

export default createForm()(Dict);
