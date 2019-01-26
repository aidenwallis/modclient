import assign from 'lodash/assign';
import EmojiConverter from 'emoji-js';

import elements from './elements';
import regexes from './regexes';
import transformBadges from './util/transformBadges';

import AppNode from './nodes/App';
import BTTVModule from './modules/BTTV';
import BadgesModule from './modules/Badges';
import CheermotesModule from './modules/Cheermotes';
import ClickModule from './modules/Click';
import EmotesModule from './modules/Emotes';
import FFZModule from './modules/FFZ';
import SettingsModule from './modules/Settings';

import TwitchAuthClient from './modules/TwitchAuthClient';
import helixClient from './modules/TwitchHelixClient';
import TwitchConnection from './modules/TwitchConnection';
import PubsubConnection from './modules/PubsubConnection';

const authClient = new TwitchAuthClient();

class App {
  constructor() {
    this.receiverConnection = null;
    this.sendConnection = null;
    this.pubsubConnection = null;
    this.currentRoomstate = {};
    this.isMod = null;
    this.token = null;
    this.userBadges = {};
    this.app = new AppNode(document.getElementById('app'));
    this.start = this.start.bind(this);
    this.emojiConverter = new EmojiConverter();
    this.emojiConverter.init_env(); // else auto-detection will trigger when we first convert
    this.emojiConverter.replace_mode = 'unified';
  }

  start() {
    if (window.location.hash.toLowerCase().startsWith('#access_token')) {
      const hashParts = window.location.hash.substring(1).split('&');
      for (let i = 0; i < hashParts.length; i++) {
        const [key, val] = hashParts[i].split('=');
        if (key.toLowerCase() === 'access_token') {
          localStorage.setItem('oauthToken', val);
          location.hash = '';
          break;
        }
      }
    }
    const token = localStorage.oauthToken;
    if (!token) {
      elements.loginOverlay.addClass('overlay-active');
      // elements.loginButton
      return;
    }
    const channelName = window.location.pathname.substring(1).split(regexes.path)[0];
    if (channelName.replace(regexes.space, '') === '') {
      elements.selectChannel.addClass('overlay-active');
      elements.selectChannel.prepare();
      return;
    }
    SettingsModule.fetchSettings();
    this.app.setLoading(true);
    authClient.validateToken(token, (err, payload) => {
      if (err || !payload || !payload.user_id) {
        localStorage.removeItem('oauthToken');
        this.start();
        return;
      }
      helixClient.setToken(token);
      helixClient.fetchChannelByLogin(channelName)
        .then((channel) => {
          this.bootstrapChannel(channel.login, channel.id, payload, token);
        })
        .catch((err) => {
          console.error(err);
          // window.location = '/';
        });
    });
  }

  bootstrapChannel(channelName, channelID, payload, token) {
    Promise.all([
      BadgesModule.fetchGlobalBadges(),
      BadgesModule.fetchChannelBadges(channelID),
      EmotesModule.fetchGlobalTwitchEmotes(payload.user_id, token),
      BTTVModule.fetchGlobalEmotes(),
      BTTVModule.fetchChannelEmotes(channelName),
      CheermotesModule.fetchCheermotes(channelID),
      FFZModule.fetchGlobalEmotes(),
      FFZModule.fetchChannelEmotes(channelID),
    ]).then((res) => {
      this.connect(payload.login, payload.user_id, token, channelName, channelID);
      new ClickModule(token);
    })
    .catch((err) => {
      console.error('error while loading badges', err);
    });
  }

  connect(username, userID, password, channelName, channelID) {
    this.receiverConnection = new TwitchConnection(username, password, channelName, channelID);
    this.sendConnection = new TwitchConnection(username, password, null, null);
    this.sendConnection.connect()
    .then(() => this.receiverConnection.connect())
    .then(() => {
      this.receiverConnection.on('ROOMSTATE', (message) => {
        if (!this.app.nodes.roomstate) {
          return;
        }
        this.currentRoomstate = assign({}, this.currentRoomstate, message.tags);
        this.app.nodes.roomstate.updateRoomstate(this.currentRoomstate);
      });
      this.receiverConnection.on('CLEARCHAT', (message) => {
        if (!this.app.nodes.messages) {
          return;
        }
        this.app.nodes.messages.receiveClearchat(message, this.isMod);
      });
      this.receiverConnection.on('USERSTATE', (message) => {
        if (this.isMod === null) {
          this.app.startChannel(channelName);
        }
        const badges = transformBadges(message.tags.badges);
        this.userBadges = badges;
        const isMod = badges.broadcaster || badges.moderator;
        if (isMod) {
          if (this.isMod === null || this.isMod === false) {
            this.connectPubsub(password)
              .then(() => {
                this.pubsubConnection.subscribeTopic(`chat_moderator_actions.${userID}.${channelID}`);
                this.registerPubsubEvents();
              });
          }
          this.isMod = true;
        } else {
          this.isMod = false;
        }
      });
      this.receiverConnection.on('PRIVMSG', (message) => this.handleMessage(message));
      this.receiverConnection.on('USERNOTICE', (message) => this.handleUsernotice(message));
      this.receiverConnection.on('NOTICE', (message) => this.handleMessage(message));
    });
  }

  registerPubsubEvents() {
    this.pubsubConnection.on('new', (message) => {
      this.app.nodes.messages.receivePubsub(message, this.receiverConnection.channel, this.receiverConnection.channelID);
    });
  }

  connectPubsub(token) {
    this.pubsubConnection = new PubsubConnection(token);
    return this.pubsubConnection.connect();
  }

  handleMessage(message) {
    if (!this.app.nodes.messages) {
      return;
    }
    this.app.nodes.messages.receiveMessage(message, this.userBadges);
  }

  handleUsernotice(message) {
    if (!this.app.nodes.messages) {
      return;
    }
    this.app.nodes.messages.receiveUsernotice(message, this.userBadges);
  }

  sendMessage(message) {
    if (!this.sendConnection) {
      throw new Error('Tried to send a message with no live connection to Twitch!');
    }
    this.sendConnection.send(`PRIVMSG #${this.receiverConnection.channel} :${this.emojiConverter.replace_colons(message)}`);
  }
}

const app = new App();

export default app;
