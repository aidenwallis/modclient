import axios from 'axios';
import assign from 'lodash/assign';
import config from '../../../config.json';

function makeApiClient(baseURL, headers = {}) {
  return axios.create({
    baseURL,
    headers: assign({}, { 'Client-ID': config.clientId }, headers),
  });
}

export default makeApiClient;
