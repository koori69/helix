import React, { Component } from 'react';
import { ScrollView, Text, Platform, Keyboard, View, StyleSheet } from 'react-native';
import { InputItem, List, Button, WhiteSpace, SegmentedControl, WingBlank } from 'antd-mobile';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import queryString from 'query-string';
import TVDBClient from '../utils/tvdb';

const TMDB_API_KEY = 'cfe422613b250f702980a3bbf9e90716';
const TMDB_TV_SEARCH = 'https://api.themoviedb.org/3/search/tv?';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_TV_BASE = 'https://www.themoviedb.org/tv';
const TVDB_BANNER = 'https://www.thetvdb.com/banners/';
const TVDB_BASE = 'https://www.thetvdb.com/';

const Item = List.Item;
const Brief = Item.Brief;

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
    this.state = {
      tvs: [],
      name: '',
      lang: 0,
      detailLang: 1,
      tvdb,
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

  tmdbSearch = async (name, lang) => {
    const tvs = new Array();
    const url = `${TMDB_TV_SEARCH}api_key=${TMDB_API_KEY}&query=${encodeURI(name)}&language=${lang}`;
    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((json) => {
        json.results.forEach((t) => {
          const item = {
            original_name: t.original_name,
            first_air_date: t.first_air_date,
            id: t.id,
            overview: t.overview,
            image: `${TMDB_IMG_BASE}${t.backdrop_path}`,
            source: 'TMDB',
          };
          tvs.push(item);
        });
      });
    }).catch((err) => {
      console.error(err);
    });
    return tvs;
  };

  onSearch = async () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    let tvs = new Array();
    const { lang, name, tvdb, dataSource } = this.state;
    if (name === '') {
      return;
    }
    let tvdbLists;
    let tmdbLists;
    console.log(dataSource);
    switch (tvsource[dataSource]) {
      case 'ALL':
        tvdbLists = await this.tvdbSearch(tvdb, name, data[lang].extra);
        tmdbLists = await this.tmdbSearch(name, data[lang].extra);
        tvs = [...tvdbLists, ...tmdbLists];
        break;
      case 'TMDB':
        tmdbLists = await this.tmdbSearch(name, data[lang].extra);
        tvs = [...tmdbLists];
        break;
      case 'TVDB':
        tvdbLists = await this.tvdbSearch(tvdb, name, data[lang].extra);
        tvs = [...tvdbLists];
        break;
      default:
        tvdbLists = await this.tvdbSearch(tvdb, name, data[lang].extra);
        tmdbLists = this.tmdbSearch(name, data[lang].extra);
        tvs = [...tvdbLists, ...tmdbLists];
    }
    this.setState({ tvs, loading: false });
  };

  onLanguageChange = (e) => {
    Keyboard.dismiss();
    this.setState({ lang: e.nativeEvent.selectedSegmentIndex });
  };

  onDataSourceChange = (e) => {
    Keyboard.dismiss();
    this.setState({ dataSource: e.nativeEvent.selectedSegmentIndex });
  };

  tvdbSearch = async (tvdb, name, lang) => {
    const tvs = new Array();
    const tvdbSource = await tvdb.searchTv({ name }, lang);
    if (tvdbSource !== null) {
      tvdbSource.forEach((t) => {
        const item = {
          original_name: t.seriesName,
          first_air_date: t.firstAired,
          id: t.id,
          overview: t.overview,
          image: `${TVDB_BANNER}${t.banner}`,
          source: 'TVDB',
        };
        tvs.push(item);
      });
    }
    return tvs;
  };

  onDetailLanguageChange = (e) => {
    Keyboard.dismiss();
    this.setState({ detailLang: e.nativeEvent.selectedSegmentIndex });
  };

  openMovie = (id, source) => {
    Keyboard.dismiss();
    const { lang, detailLang } = this.state;
    let url = '';
    if (source === 'TMDB') {
      url = `${TMDB_TV_BASE}/${id}?language=${data[lang].extra}`;
    } else {
      const param = { tab: 'series', id, lid: data[detailLang].lid };
      url = `${TVDB_BASE}?${queryString.stringify(param)}`;
    }
    WebBrowser.openBrowserAsync(url);
  };

  render() {
    const { tvs } = this.state;
    return (
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <InputItem
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
        <List renderHeader={() => 'Search Language'} >
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
        <List renderHeader={() => 'Detail Language'} >
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
        <List renderHeader={() => 'TVs'} className="my-list" >
          {
            tvs.map((m) => {
              return (
                <Item
                  arrow="empty"
                  multipleLine
                  onClick={() => this.openMovie(m.id, m.source)}
                  key={m.id}
                  thumb={m.image}
                >
                  {m.original_name}
                  <View
                    style={m.source === 'TMDB' ? styles.tmdbBadge : styles.tvdbBadge}
                  >
                    <Text style={styles.whiteFont}>
                      {m.source}
                    </Text>
                  </View>
                  <Brief>
                    <Text>{m.first_air_date}</Text>
                  </Brief>
                  <Text numberOfLines={4}>{m.overview}</Text>
                </Item>
              );
            })
                    }
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  tmdbBadge: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED784A',
    borderRadius: 5,
    backgroundColor: '#ED784A',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tvdbBadge: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#8A6BBE',
    borderRadius: 5,
    backgroundColor: '#8A6BBE',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteFont: { color: 'white' },
});
