import React, { Component } from 'react';
import { ScrollView, Text, Platform, Keyboard, View, StyleSheet } from 'react-native';
import { InputItem, List, Button, WhiteSpace, SegmentedControl, WingBlank, Badge } from 'antd-mobile';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const TMDB_API_KEY = 'cfe422613b250f702980a3bbf9e90716';
const TVDB_TV_SEARCH = 'https://api.themoviedb.org/3/search/tv?';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const TV_BASE = 'https://www.themoviedb.org/tv';

const Item = List.Item;
const Brief = Item.Brief;

const data = [
    { value: 0, label: 'Chinese', extra: 'zh' },
    { value: 1, label: 'English', extra: 'en' },
    { value: 2, label: 'Japanese', extra: 'ja' },
];
const langArray = ['Chinese', 'English', 'Japanese'];

export default class TvScreen extends Component {
  static navigationOptions = {
    title: 'TV',
  };

  constructor(props) {
    super(props);
    this.state = {
      tvs: [],
      name: '',
      lang: 0,
    };
  }

  onNameChange = (name) => {
    this.setState({ name });
    if (name === null || name === '') {
      this.setState({ tvs: [] });
    }
  };

  onSearch = () => {
    Keyboard.dismiss();
    const { lang, name } = this.state;
    if (name === '') {
      return;
    }
    const url = `${TVDB_TV_SEARCH}api_key=${TMDB_API_KEY}&query=${encodeURI(name)}&language=${data[lang].extra}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((json) => {
        const tvs = json.results;
        this.setState({ tvs });
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  onLanguageChange = (e) => {
    Keyboard.dismiss();
    this.setState({ lang: e.nativeEvent.selectedSegmentIndex });
  };

  openMovie = (id) => {
    Keyboard.dismiss();
    const { lang } = this.state;
    WebBrowser.openBrowserAsync(`${TV_BASE}/${id}?language=${data[lang].extra}`);
  };

  render() {
    const { tvs } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <InputItem
          onChange={this.onNameChange}
          placeholder={'TV Name'}
        />
        <List renderHeader={() => 'Language'} >
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
          <Button type="primary" onClick={this.onSearch}>
                  Search
                  <Ionicons name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} size={26} />
          </Button>
        </WingBlank>
        <WhiteSpace />
        <List renderHeader={() => 'TVs'} className="my-list">
          <ScrollView>
            {
                        tvs.map((m) => {
                          return (
                            <Item
                              arrow="empty"
                              multipleLine
                              onClick={() => this.openMovie(m.id)}
                              key={m.id}
                              thumb={`${IMG_BASE}${m.backdrop_path}`}
                            >
                              {m.original_name}
                              <View
                                style={styles.badge}
                              >
                                <Text style={styles.whiteFont}>
                                    TMDB
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
          </ScrollView>
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED784A',
    borderRadius: 5,
    backgroundColor: '#ED784A',
    width: 50,
  },
  whiteFont: { color: 'white' },
});
