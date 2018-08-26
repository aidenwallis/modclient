import axios from 'axios';
import keys from 'lodash/keys';
import BadgesModule from './Badges';

class FFZModule {
  constructor() {
    this.globalEmotes = {};
    this.channelEmotes = {};
  }

  fetchGlobalEmotes() {
    return axios.get('https://api.frankerfacez.com/v1/set/global')
      .then((res) => res.data)
      .then((res) => {
        for (let i = 0; i < res.default_sets.length; i++) {
          const set = res.sets[res.default_sets[i]];
          if (set.emoticons) {
            for (let j = 0; j < set.emoticons.length; j++) {
              const emote = set.emoticons[j];
              this.globalEmotes[emote.name] = {
                id: emote.id,
                url: emote.urls[Math.min(...keys(emote.urls))],
                provider: 'ffz',
                type: 'global',
              }
            }
          }
        }
      })
      .catch((err) => console.error('error while loading ffz global emotes', err));
  }

  fetchChannelEmotes(channelID) {
    return axios.get(`https://api.frankerfacez.com/v1/room/id/${channelID}`)
      .then((res) => res.data)
      .then((res) => {
        if (res.room.moderator_badge) {
          BadgesModule.overrideModeratorBadge(res.room.moderator_badge);
        }
        const set = res.sets[res.room.set];
        if (set.emoticons) {
          this.channelEmotes = set.emoticons.reduce((acc, cur) => {
            acc[cur.name] = {
              id: cur.id,
              url: cur.urls[Math.min(...keys(cur.urls))],
              provider: 'ffz',
              type: 'channel',
            };
            return acc;
          }, {});
        }
        return true;
      })
      .catch((err) => console.error(`error while loading ffz emotes for channel ${channelID}`, err));
  }

  findEmote(emoteCode) {
    return this.channelEmotes[emoteCode] || this.globalEmotes[emoteCode];
  }
}

export default new FFZModule();
