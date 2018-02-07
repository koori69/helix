import queryString from 'query-string';

const USER_KEY = '';
const API_KEY = '';
const USER_NAME = '';
const URL_BASE = 'https://api.thetvdb.com';
let JWT_TOKEN = '';

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

  async searchTv(param, lang) {
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
}
