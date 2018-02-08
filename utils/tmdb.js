import { WebBrowser } from 'expo';

const TMDB_API_KEY = 'cfe422613b250f702980a3bbf9e90716';
const TMDB_TV_SEARCH = 'https://api.themoviedb.org/3/search/tv?';
const TMDB_MOVIE_SEARCH = 'https://api.themoviedb.org/3/search/movie?';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_TV_BASE = 'https://www.themoviedb.org/tv';
const TMDB_MOVIE_BASE = 'https://www.themoviedb.org/movie';

export default class TMDBClient {

  async tvSearch({ name, lang }) {
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
  }

  async movieSearch({ name, lang }) {
    let movies = new Array();
    const url = `${TMDB_MOVIE_SEARCH}query=${encodeURI(name)}&api_key=${TMDB_API_KEY}&language=${lang}`;
    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((json) => {
        movies = json.results;
      });
    }).catch((err) => {
      console.error(err);
    });
    return movies;
  }

  openMovie({ id, lang }) {
    WebBrowser.openBrowserAsync(`${TMDB_MOVIE_BASE}/${id}?language=${lang}`);
  }

  openTv({ id, lang }) {
    WebBrowser.openBrowserAsync(`${TMDB_TV_BASE}/${id}?language=${lang}`);
  }
}
