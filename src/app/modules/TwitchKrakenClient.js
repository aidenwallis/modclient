import makeApiClient from '../util/makeApiClient';

class TwitchKrakenClient {
  constructor() {
    this.client = makeApiClient('https://api.twitch.tv/kraken/');
  }
}

export default TwitchKrakenClient;
