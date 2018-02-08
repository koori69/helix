import queryString from 'query-string';
import { WebBrowser } from 'expo';

const USER_KEY = '';
const API_KEY = '';
const USER_NAME = '';
const URL_BASE = 'https://api.thetvdb.com';
let JWT_TOKEN = '';
const TVDB_BANNER = 'https://www.thetvdb.com/banners/';
const TVDB_BASE = 'https://www.thetvdb.com/';

export default class TVDBClient {
  constructor() {
    if (JWT_TOKEN === '') {
      this.login();
    }
  }

  login() {
    const url = `${URL_BASE}/login`;
    const param = { apikey: API_KEY, username: USER_NAME, userkey: USER_KEY };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(param),
    }).then((response) => {
      response.json().then((json) => {
        JWT_TOKEN = json.token;
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  async searchTv({ param, lang }) {
    const url = `${URL_BASE}/search/series?${queryString.stringify(param)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${JWT_TOKEN}`,
        'Accept-Language': lang,
      },
    });

    if (!(response.status >= 200 && response.status < 300)) {
      this.login();
      return null;
    }
    const json = await response.json();
    return json.data;
  }

  async freshToken() {
    const url = `${URL_BASE}/refresh_token`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    });
    if (!(response.status >= 200 && response.status < 300)) {
      return;
    }
    const json = await response.json();
    JWT_TOKEN = json.token;
  }

  async search({ name, lang }) {
    const tvs = new Array();
    const tvdbSource = await this.searchTv({ param: { name }, lang });
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
  }

  open({ id, lid }) {
    const param = { tab: 'series', id, lid };
    const url = `${TVDB_BASE}?${queryString.stringify(param)}`;
    WebBrowser.openBrowserAsync(url);
  }
}
