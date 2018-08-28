import map from 'lodash/map';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import TwitchKrakenClient from './TwitchKrakenClient';

class CheermotesModule {
  constructor() {
    // this.globalCheermotes = {};
    this.cheermotes = {};
  }

  // fetchGlobalCheermotes() {
  //   return TwitchKrakenClient.fetchGlobalCheermotes()
  //     .then((data) => {
  //       this.globalCheermotes = data.actions.reduce((acc, cheermote) => {
  //         const scale = last(cheermote.scales);
  //         const background = 'dark';
  //         const state = 'animated';
  //         const cheerObj = {
  //           name: cheermote.prefix,
  //           id: cheermote.prefix.toLowerCase(),
  //           tiers: sortBy(map(cheermote.tiers, tier => ({
  //             name: `${cheermote.prefix} ${tier.min_bits}`,
  //             minBits: tier.min_bits,
  //             url: tier.images[background][state][scale],
  //             color: tier.color
  //           })), 'minBits'),
  //         };
  //         acc[cheerObj.id] = cheerObj;
  //         return acc;
  //       }, {});
  //     });
  // }

  fetchCheermotes(channelID) {
    return TwitchKrakenClient.fetchChannelCheermotes(channelID)
      .then((data) => {
        this.cheermotes = data.actions.reduce((acc, cheermote) => {
          const scale = Math.min(...cheermote.scales.map(s => parseInt(s, 10)));
          const background = 'dark';
          const state = 'animated';
          const cheerObj = {
            name: cheermote.prefix,
            id: cheermote.prefix.toLowerCase(),
            tiers: sortBy(map(cheermote.tiers, tier => ({
              name: `${cheermote.prefix} ${tier.min_bits}`,
              minBits: tier.min_bits,
              url: tier.images[background][state][scale],
              color: tier.color
            })), 'minBits'),
          };
          acc[cheerObj.id] = cheerObj;
          return acc;
        }, {});
      });
  }

  findCheermote(cheerID) {
    return this.cheermotes[cheerID] || null;
  }
}

export default new CheermotesModule();
