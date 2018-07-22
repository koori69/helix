import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;

export default class TvResultScreen extends Component {
  static navigationOptions = {
    title: 'Result',
    tabBarVisible: false,
  };

  openMovie = (id, source, name) => {
    const { lang, tvdb, tmdb } = this.props.navigation.state.params;
    if (source === 'TMDB') {
      tmdb.openTv({ id, lang });
    } else {
      tvdb.open({ name });
    }
  };

  render() {
    const { tvs } = this.props.navigation.state.params;
    return (
      <ScrollView>
        <List>
          {
            tvs.map((m) => {
              return (
                <Item
                  arrow="empty"
                  multipleLine
                  onClick={() => this.openMovie(m.id, m.source, m.slug)}
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
                    <Text>{m.slug}</Text>
                  </Brief>
                  <Brief>
                    <Text>{m.first_air_date}</Text>
                  </Brief>
                  <Text numberOfLines={4}>{m.overview}</Text>
                </Item>
              );
            })
          }
        </List>
      </ScrollView>);
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
