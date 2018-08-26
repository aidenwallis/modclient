import axios from 'axios';

class BTTVModule {
  constructor() {
    this.globalEmotes = {};
    this.channelEmotes = {};
  }

  fetchGlobalEmotes() {
    return axios.get('https://api.betterttv.net/2/emotes')
      .then((res) => res.data)
      .then((res) => {
        this.globalEmotes = res.emotes.reduce((acc, cur) => {
          acc[cur.code] = {
            id: cur.id,
            url: res.urlTemplate.replace('{{id}}', cur.id).replace('{{image}}', '1x'),
            provider: 'bttv',
            type: 'global',
          };
          return acc;
        }, {});
        return true;
      })
      .catch((err) => console.error('error while loading bttv global emotes', err));
  }

  fetchChannelEmotes(channelName) {
    return axios.get(`https://api.betterttv.net/2/channels/${channelName}`)
      .then((res) => res.data)
      .then((res) => {
        this.channelEmotes = res.emotes.reduce((acc, cur) => {
          acc[cur.code] = {
            id: cur.id,
            url: res.urlTemplate.replace('{{id}}', cur.id).replace('{{image}}', '1x'),
            provider: 'bttv',
            type: 'global',
          };
          return acc;
        }, {});
        return true;
      })
      .catch((err) => console.error(`error while loading bttv channel emotes for channel ${channelName}`, err));
  }

  findEmote(emoteCode) {
    return this.channelEmotes[emoteCode] || this.globalEmotes[emoteCode] || null;
  }
}

export default new BTTVModule();
