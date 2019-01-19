import makeApiClient from "../util/makeApiClient";

class TwitchHelixClient {
  constructor() {
    this.client = makeApiClient('https://api.twitch.tv/helix/');
  }

  setToken(token) {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  fetchChannelByLogin(login) {
    return this.client.get(`users?login=${login}`)
      .then((res) => res.data && res.data.data ? res.data.data[0] : null);
  }
}

export default new TwitchHelixClient();
