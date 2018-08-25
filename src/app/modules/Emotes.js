import axios from 'axios';
import makeApiClient from '../util/makeApiClient';

class EmotesModule {
  constructor() {
    this.client = axios.create();
    this.twitchClient = makeApiClient();
    this.globalEmotes = {};
  }

  fetchGlobalTwitchEmotes(userID, userToken) {
    return this.twitchClient.get(`https://api.twitch.tv/v5/users/${userID}/emotes?on_site=1`, {
      headers: { Authorization: `OAuth ${userToken}` },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error('error while fetching global emotes', err));
  }
}

export default new EmotesModule();
