import React, { Component } from 'react';
import { ScrollView, Platform, Text, Keyboard } from 'react-native';
import { InputItem, List, WhiteSpace, Button, SegmentedControl, WingBlank } from 'antd-mobile';
import { Ionicons } from '@expo/vector-icons';
import TMDBClient from '../utils/tmdb';

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
    const tmdb = new TMDBClient();
    this.state = {
      movies: [],
      lang: 0,
      name: '',
      loading: false,
      tmdb,
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
    this.setState({ loading: true });
    const { lang, name, tmdb } = this.state;
    if (name === '') {
      return;
    }
    tmdb.movieSearch({ name, lang: data[lang].extra });
  };

  onLanguageChange = (e) => {
    Keyboard.dismiss();
    this.setState({ lang: e.nativeEvent.selectedSegmentIndex });
  };

  openMovie = (id) => {
    Keyboard.dismiss();
    const { lang, tmdb } = this.state;
    tmdb.openMovie({ id, lang: data[lang].extra });
  };

  render() {
    const { movies } = this.state;
    return (
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always" >
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
          <Button type="primary" onClick={() => this.onSearch()} loading={this.state.loading}>
                  Search
                  <Ionicons name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} size={26} />
          </Button>
        </WingBlank>
        <WhiteSpace />

        <List renderHeader={() => 'Movies'} className="my-list" >
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
        </List>
      </ScrollView>
    );
  }
}
