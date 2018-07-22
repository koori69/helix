import React, { Component } from 'react';
import { ScrollView, Platform, Keyboard } from 'react-native';
import { InputItem, List, Button, WhiteSpace, SegmentedControl, WingBlank, Toast } from 'antd-mobile';
import { Ionicons } from '@expo/vector-icons';
import TVDBClient from '../utils/tvdb';
import TMDBClient from '../utils/tmdb';

const data = [
    { value: 0, label: 'Chinese', extra: 'zh', lid: 27 },
    { value: 1, label: 'English', extra: 'en', lid: 7 },
    { value: 2, label: 'Japanese', extra: 'ja', lid: 25 },
];
const langArray = ['Chinese', 'English', 'Japanese'];
const tvsource = ['ALL', 'TVDB', 'TMDB'];

export default class TvScreen extends Component {
  static navigationOptions = {
    title: 'TV',
  };

  constructor(props) {
    super(props);
    const tvdb = new TVDBClient();
    const tmdb = new TMDBClient();
    this.state = {
      tvs: [],
      name: '',
      lang: 0,
      detailLang: 1,
      tvdb,
      tmdb,
      loading: false,
      dataSource: 0,
    };
  }

  onNameChange = (name) => {
    this.setState({ name });
    if (name === null || name === '') {
      this.setState({ tvs: [] });
    }
  };

  onSearch = async () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    let tvs = new Array();
    const { lang, name, tvdb, dataSource, tmdb, detailLang } = this.state;
    if (name === '') {
      return;
    }
    let tvdbLists;
    let tmdbLists;
    switch (tvsource[dataSource]) {
      case 'ALL':
        tvdbLists = await tvdb.search({ name, lang: data[detailLang].extra });
        tmdbLists = await tmdb.tvSearch({ name, lang: data[lang].extra });
        tvs = [...tvdbLists, ...tmdbLists];
        break;
      case 'TMDB':
        tmdbLists = await tmdb.tvSearch({ name, lang: data[lang].extra });
        tvs = [...tmdbLists];
        break;
      case 'TVDB':
        tvdbLists = await tvdb.search({ name, lang: data[detailLang].extra });
        tvs = [...tvdbLists];
        break;
      default:
        tvdbLists = await tvdb.search({ name, lang: data[detailLang].extra });
        tmdbLists = await tmdb.tvSearch({ name, lang: data[lang].extra });
        tvs = [...tvdbLists, ...tmdbLists];
    }
    this.setState({ tvs, loading: false });
    if (tvs.length > 0) {
      this.props.navigation.navigate('TvResult', { tvs, lang: data[lang].extra, detailLang: data[detailLang].lid, tvdb, tmdb });
    } else {
      Toast.offline('No Result!', 1);
    }
  };

  onLanguageChange = (e) => {
    Keyboard.dismiss();
    this.setState({ lang: e.nativeEvent.selectedSegmentIndex });
  };

  onDataSourceChange = (e) => {
    Keyboard.dismiss();
    this.setState({ dataSource: e.nativeEvent.selectedSegmentIndex });
  };

  onDetailLanguageChange = (e) => {
    Keyboard.dismiss();
    this.setState({ detailLang: e.nativeEvent.selectedSegmentIndex });
  };

  render() {
    return (
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <InputItem
          clear
          onChange={this.onNameChange}
          placeholder={'TV Name'}
        />
        <List renderHeader={() => 'Data Source'} >
          <WingBlank>
            <WhiteSpace />
            <SegmentedControl
              selectedIndex={this.state.dataSource}
              values={tvsource}
              onChange={this.onDataSourceChange}
            />
            <WhiteSpace />
          </WingBlank>
        </List>
        <List renderHeader={() => 'TMDB Language'} >
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
        <List renderHeader={() => 'TVDB Language'} >
          <WingBlank>
            <WhiteSpace />
            <SegmentedControl
              selectedIndex={this.state.detailLang}
              values={langArray}
              onChange={this.onDetailLanguageChange}
            />
            <WhiteSpace />
          </WingBlank>
        </List>
        <WhiteSpace />
        <WingBlank>
          <Button type="primary" onClick={this.onSearch} loading={this.state.loading}>
                  Search
                  <Ionicons name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} size={26} />
          </Button>
        </WingBlank>
        <WhiteSpace />
      </ScrollView>
    );
  }
}
