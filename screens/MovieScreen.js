import React, { Component } from 'react';
import { View, ScrollView, Platform, Text, Keyboard } from 'react-native';
import { InputItem, List, WhiteSpace, Button, SegmentedControl, WingBlank } from 'antd-mobile';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const TMDB_API_KEY = 'cfe422613b250f702980a3bbf9e90716';
const QUERY_URL = 'https://api.themoviedb.org/3/search/movie?';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const MOVIE_BASE = 'https://www.themoviedb.org/movie';

const Item = List.Item;
const Brief = Item.Brief;

const data = [
    { value: 0, label: 'Chinese', extra: 'zh' },
    { value: 1, label: 'English', extra: 'en' },
    { value: 2, label: 'Japanese', extra: 'ja' },
];
const langArray = ['Chinese', 'English', 'Japanese'];

export default class MovieScreen extends Component {
  static navigationOptions = {
    title: 'Movie',
  };

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      lang: 0,
      name: '',
    };
  }

  onNameChange = (name) => {
    this.setState({ name });
    if (name === null || name === '') {
      this.setState({ movies: [] });
    }
  };

  onSearch=() => {
    Keyboard.dismiss();
    const { lang, name } = this.state;
    if (name === '') {
      return;
    }
    const url = `${QUERY_URL}query=${encodeURI(name)}&api_key=${TMDB_API_KEY}&language=${data[lang].extra}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((json) => {
        const movies = json.results;
        this.setState({ movies });
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
    WebBrowser.openBrowserAsync(`${MOVIE_BASE}/${id}?language=${data[lang].extra}`);
  };

  render() {
    const { movies } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <InputItem
          clear
          onChange={this.onNameChange}
          placeholder={'Movie Name'}
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
          <Button type="primary" onClick={() => this.onSearch()}>
                  Search
                  <Ionicons name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} size={26} />
          </Button>
        </WingBlank>
        <WhiteSpace />

        <List renderHeader={() => 'Movies'} className="my-list">
          <ScrollView>
            {
              movies.map((m) => {
                return (
                  <Item
                    multipleLine
                    wrap
                    onClick={() => this.openMovie(m.id)}
                    key={m.id}
                    thumb={`${IMG_BASE}${m.backdrop_path}`}
                  >
                    {m.original_title}
                    <Brief>{m.release_date}</Brief>
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
