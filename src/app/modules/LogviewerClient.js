import axios from 'axios';

class LogviewerClient {
  constructor() {
    this.client = axios.create({ baseURL: 'https://cbenni.com/api/logs/', headers: {} });
  }

  fetchLogs(username, channel) {
    return this.client.get(`${channel}?nick=${username}`)
      .then((res) => res.data);
  }
}

export default LogviewerClient;
