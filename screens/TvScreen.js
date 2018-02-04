import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { InputItem, List } from 'antd-mobile';
import { WebBrowser } from 'expo';

const TVDB_SEARCH = 'https://www.themoviedb.org/search/multi?language=zh-CN&query=';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const TV_BASE = 'https://www.themoviedb.org/tv';

const Item = List.Item;
const Brief = Item.Brief;

export default class TvScreen extends Component {
  static navigationOptions = {
    title: 'TV',
  };

  constructor(props) {
    super(props);
    this.state = {
      tvs: [],
    };
  }

  onChange = (word) => {
    if (word === null || word === '') {
      this.setState({ tvs: [] });
      return;
    }
    const url = `${TVDB_SEARCH}${encodeURI(word)}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((json) => {
        const res = json.results;
        const tvs = new Array();
        res.forEach((t) => {
          if (t.media_type === 'tv') {
            const r = { ...t, source: 'tmdv' };
            tvs.push(r);
          }
        },
        );
        this.setState({ tvs });
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  openMovie = (id) => {
    WebBrowser.openBrowserAsync(`${TV_BASE}/${id}`);
  };

  render() {
    const { tvs } = this.state;
    return (
      <ScrollView>
        <InputItem
          onChange={this.onChange}
          placeholder={'TV Name'}
        />
        <List renderHeader={() => 'TVs'} className="my-list">
          {
                        tvs.map((m) => {
                          return (
                            <Item
                              arrow="horizontal"
                              multipleLine
                              wrap
                              onClick={() => this.openMovie(m.id)}
                              key={m.id}
                              thumb={`${IMG_BASE}${m.backdrop_path}`}
                            >
                              {m.original_name}<Brief>{m.first_air_date}</Brief>
                              {m.overview}
                            </Item>
                          );
                        })
                    }
        </List>
      </ScrollView>
    );
  }
}
