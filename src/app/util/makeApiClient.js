import axios from 'axios';
import config from '../../../config.json';

function makeApiClient(baseURL) {
  return axios.create({
    baseURL,
    headers: {
      'Client-ID': config.clientId,
    },
  });
}

export default makeApiClient;
