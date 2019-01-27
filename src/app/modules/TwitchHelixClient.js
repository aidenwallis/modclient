import makeApiClient from "../util/makeApiClient";

class TwitchHelixClient {
  constructor() {
    this.token = null;
    this.client = makeApiClient('https://api.twitch.tv/helix/');
  }

  setToken(token) {
    this.token = token;
  }

  getOptions() {
    return { headers: this.getHeaders() };
  }

  getHeaders() {
    if (!this.token) {
      return {};
    }
    return { Authorization: `Bearer ${this.token}` };
  }

  fetchChannelByLogin(login) {
    return this.client.get(`users?login=${login}`, this.getOptions())
      .then((res) => res.data && res.data.data ? res.data.data[0] : null);
  }

  fetchUserID(login) {
    return this.client.get(`users?login=${login}`, this.getOptions())
      .then((res) => res.data && res.data.data && res.data.data[0] ? res.data.data[0].id : null);
  }
}

export default new TwitchHelixClient();
