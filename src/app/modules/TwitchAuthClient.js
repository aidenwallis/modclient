import axios from 'axios';

class TwitchAuthClient {
  constructor() {
    this.client = axios.create({ baseURL: 'https://id.twitch.tv/oauth2/' });
  }

  validateToken(token, done) {
    this.client.get('validate', {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    })
    .then((res) => {
      done(null, res.data);
    })
    .catch((err) => {
      done(err);
    });
  }
}

export default TwitchAuthClient;
