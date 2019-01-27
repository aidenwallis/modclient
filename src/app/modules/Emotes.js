import axios from 'axios';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import makeApiClient from '../util/makeApiClient';

class EmotesModule {
  constructor() {
    this.client = axios.create();
    this.twitchClient = makeApiClient();
    this.globalEmotes = {};
    this.userEmotes = [];
    this.userEmotesText = [];
  }

  fetchGlobalTwitchEmotes(userID, userToken) {
    return this.twitchClient.get(`https://api.twitch.tv/v5/users/${userID}/emotes?on_site=1`, {
      headers: { Authorization: `OAuth ${userToken}` },
    })
      .then((res) => {
        const sets = res.data.emoticon_sets;
        const globalEmotes = sets[0];
        if (globalEmotes) {
          this.globalEmotes = globalEmotes.reduce(emote => ({
            id: emote.id,
            url: `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`,
            provider: 'twitch',
            type: 'global',
          }))
        }
        const allEmotes = values(sets);
        // console.log(sets);
        this.userEmotes = flatten(allEmotes.map(emotes => emotes.map(emote => ({
          id: emote.id,
          url: `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`,
          provider: 'twitch',
          type: 'user',
          code: emote.code,
        }))));
        this.userEmotesText = this.userEmotes.map(e => e.code);
        console.log(this.userEmotes);
      })
      .catch((err) => console.error('error while fetching global emotes', err));
  }
}

export default new EmotesModule();
