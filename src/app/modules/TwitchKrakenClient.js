import makeApiClient from '../util/makeApiClient';
const client = makeApiClient('https://api.twitch.tv/kraken/', { Accept: 'application/vnd.twitchtv.v5+json' });
class TwitchKrakenClient {
  static resolveAutomod(action, msgID, token) {
    return client.post(`chat/automod/${action}`, { msg_id: msgID }, {
      headers: { 'Authorization': `OAuth ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => console.error('failed to resolve automod msg', err));
  }

  static fetchGlobalCheermotes() {
    return client.get('bits/actions')
      .then((res) => res.data)
      .catch((err) => console.error('error while fetching global cheermotes', err));
  }

  static fetchChannelCheermotes(channelID) {
    return client.get(`bits/actions?channel_id=${channelID}`)
      .then((res) => res.data)
      .catch((err) => console.error(`failed to get cheermotes for channel id ${channelID}`, err));
  }
}

export default TwitchKrakenClient;
