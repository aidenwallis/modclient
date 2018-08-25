import axios from 'axios';

class BadgesModule {
  constructor() {
    this.globalBadges = {};
    this.channelBadges = {};
  }

  fetchGlobalBadges() {
    return this._badgeRequest('global').then((badges) => {
      this.globalBadges = badges;
      return true;
    });
  }

  fetchChannelBadges(channelID) {
    return this._badgeRequest(`channels/${channelID}`).then((badges) => {
      this.channelBadges = badges;
      return true;
    });
  }

  _badgeRequest(resource) {
    return axios.get(`https://badges.twitch.tv/v1/badges/${resource}/display?language=en`)
    .then((res) => res.data && res.data.badge_sets ? res.data.badge_sets : {})
    .catch((err) => console.error(`error while fetching badges for resource ${resource}`, err));
  }
}

export default new BadgesModule();
