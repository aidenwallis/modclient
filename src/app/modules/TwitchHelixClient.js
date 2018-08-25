import makeApiClient from "../util/makeApiClient";

class TwitchHelixClient {
  constructor() {
    this.client = makeApiClient('https://api.twitch.tv/helix/');
  }

  fetchChannelByLogin(login) {
    return this.client.get(`users?login=${login}`)
      .then((res) => res.data && res.data.data ? res.data.data[0] : null);
  }
}

export default TwitchHelixClient;
