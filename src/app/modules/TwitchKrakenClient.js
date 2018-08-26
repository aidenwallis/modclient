import makeApiClient from '../util/makeApiClient';

class TwitchKrakenClient {
  constructor() {
    this.client = makeApiClient('https://api.twitch.tv/kraken/', { Accept: 'application/vnd.twitchtv.v5+json' });
  }

  resolveAutomod(action, msgID, token) {
    return this.client.post(`https://api.twitch.tv/kraken/chat/automod/${action}`, { msg_id: msgID }, {
      headers: { 'Authorization': `OAuth ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => console.error('failed to resolve automod msg', err));
  }
}

export default TwitchKrakenClient;
