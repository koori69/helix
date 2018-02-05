import React, { Component } from 'react';
import { View, Platform, Keyboard, WebView } from 'react-native';
import { InputItem, List, WhiteSpace, Button, SegmentedControl, WingBlank } from 'antd-mobile';
import { Ionicons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';

const data = [
    { value: 0, label: '沪江小D-日中', extra: 'jc' },
    { value: 1, label: '沪江小D-中日', extra: 'cj' },
];
const langArray = ['沪江小D-日中', '沪江小D-中日'];

export default class DictScreen extends Component {
  static navigationOptions = {
    title: 'Dict',
  };

  constructor(props) {
    super(props);
    this.state = {
      lang: 0,
      url: '',
    };
  }

  onWordChange = (word) => {
    this.setState({ word });
  };

  onLanguageChange = (e) => {
    Keyboard.dismiss();
    this.setState({ lang: e.nativeEvent.selectedSegmentIndex });
  };

  onSearch() {
    Keyboard.dismiss();
    const baseUrl = 'https://dict.hjenglish.com/jp';
    const { word, lang } = this.state;
    const url = `${baseUrl}/${data[lang].extra}/${encodeURI(word)}`;
    this.setState({ url });
    WebBrowser.openBrowserAsync(url);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <InputItem
          clear
          onChange={this.onWordChange}
          placeholder={'search word'}
        />
        <List renderHeader={() => 'Language'} className="my-list">
          <WingBlank>
            <WhiteSpace />
            <SegmentedControl
              selectedIndex={this.state.lang}
              values={langArray}
              onChange={this.onLanguageChange}
            />
            <WhiteSpace />
          </WingBlank>
        </List>
        <WhiteSpace />
        <WingBlank>
          <Button type="primary" onClick={() => this.onSearch()} >
              Search
              <Ionicons name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} size={26} />
          </Button>
        </WingBlank>
        <WhiteSpace />
        <List renderHeader={() => 'Result'} className="my-list" />
        <WhiteSpace />
        {/* <WebView*/}
        {/* source={{*/}
        {/* uri: this.state.url,*/}
        {/* }}*/}
        {/* userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"*/}
        {/* />*/}
      </View>
    );
  }
}

