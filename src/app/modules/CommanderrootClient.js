import axios from 'axios';

class CommanderrootClient {
  constructor() {
    this.client = axios.create({ baseURL: 'https://twitch-tools.rootonline.de/', headers: {} });
  }

  fetchChangelogs(username) {
    return this.client.get(`username_changelogs_search.php`, {
        params: {
          format: 'json',
          q: username,
        },
      })
      .then((res) => res.data);
  }
}

export default CommanderrootClient;
