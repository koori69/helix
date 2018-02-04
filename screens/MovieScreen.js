import React, { Component } from 'react';
import { ScrollView, Text, Image } from 'react-native';
import { InputItem, List, Card, WingBlank } from 'antd-mobile';
import { WebBrowser } from 'expo';

const TMDB_API_KEY = 'cfe422613b250f702980a3bbf9e90716';
const QUERY_URL = 'https://api.themoviedb.org/3/search/movie?';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const MOVIE_BASE = 'https://www.themoviedb.org/movie';

const Item = List.Item;
const Brief = Item.Brief;

export default class MovieScreen extends Component {
  static navigationOptions = {
    title: 'Movie',
  };

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
    };
  }

  onChange = (word) => {
    if (word === null || word === '') {
      this.setState({ movies: [] });
      return;
    }
    const url = `${QUERY_URL}query=${encodeURI(word)}&api_key=${TMDB_API_KEY}`;
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

  openMovie = (id) => {
    WebBrowser.openBrowserAsync(`${MOVIE_BASE}/${id}`);
  };

  render() {
    const { movies } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        <InputItem
          onChange={this.onChange}
          placeholder={'Movie Name'}
        />
        <List renderHeader={() => 'Movies'} className="my-list">
          {
              movies.map((m) => {
                return (
                  <Item
                    arrow="horizontal"
                    multipleLine
                    wrap
                    onClick={() => this.openMovie(m.id)}
                    key={m.id}
                    thumb={`${IMG_BASE}${m.backdrop_path}`}
                  >
                    {m.original_title}<Brief>{m.release_date}</Brief>
                    {m.overview}
                    <Image source={{ uri: `${IMG_BASE}${m.backdrop_path}` }} />
                  </Item>
                );
              })
            }
        </List>
      </ScrollView>
    );
  }
}
