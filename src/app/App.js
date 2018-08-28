import assign from 'lodash/assign';

import elements from './elements';
import regexes from './regexes';

import AppNode from './nodes/App';
import BTTVModule from './modules/BTTV';
import BadgesModule from './modules/Badges';
import ClickModule from './modules/Click';
import EmotesModule from './modules/Emotes';
import FFZModule from './modules/FFZ';
import SettingsModule from './modules/Settings';

import TwitchAuthClient from './modules/TwitchAuthClient';
import TwitchHelixClient from './modules/TwitchHelixClient';
import TwitchConnection from './modules/TwitchConnection';
import PubsubConnection from './modules/PubsubConnection';

const authClient = new TwitchAuthClient();
const helixClient = new TwitchHelixClient();

class App {
  constructor() {
    this.receiverConnection = null;
    this.sendConnection = null;
    this.pubsubConnection = null;
    this.currentRoomstate = {};
    this.isMod = null;
    this.token = null;
    this.app = new AppNode(document.getElementById('app'));
    this.start = this.start.bind(this);
    this.validateToken = this.validateToken.bind(this);
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
    if (!localStorage.oauthToken) {
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
    helixClient.fetchChannelByLogin(channelName)
      .then((channel) => {
        this.validateToken(channelName, channel.id);
      })
      .catch(() => {
        window.location = '/';
      });
  }

  validateToken(channelName, channelID) {
    const token = localStorage.oauthToken;
    this.token = token;
    authClient.validateToken(token, (err, payload) => {
      if (err || !payload || !payload.user_id) {
        localStorage.removeItem('oauthToken');
        this.start();
        return;
      }
      Promise.all([
        BadgesModule.fetchGlobalBadges(),
        BadgesModule.fetchChannelBadges(channelID),
        EmotesModule.fetchGlobalTwitchEmotes(payload.user_id, token),
        BTTVModule.fetchGlobalEmotes(),
        BTTVModule.fetchChannelEmotes(channelName),
        FFZModule.fetchGlobalEmotes(),
        FFZModule.fetchChannelEmotes(channelID),
      ]).then((res) => {
        this.connect(payload.login, payload.user_id, token, channelName, channelID);
        new ClickModule(token);
      })
      .catch((err) => {
        console.error('error while loading badges', err);
      })
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
        console.log(message, this.isMod);
        if (this.isMod === null) {
          this.app.startChannel(channelName);
        }
        const isMod = message.tags.badges.includes('moderator') || message.tags.badges.includes('broadcaster');
        console.log(isMod);
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
    this.app.nodes.messages.receiveMessage(message, this.isMod);
  }

  handleUsernotice(message) {
    if (!this.app.nodes.messages) {
      return;
    }
    this.app.nodes.messages.receiveUsernotice(message, this.isMod);
  }

  sendMessage(message) {
    if (!this.sendConnection) {
      throw new Error('Tried to send a message with no live connection to Twitch!');
    }
    this.sendConnection.send(`PRIVMSG #${this.receiverConnection.channel} :${message}`);
  }
}

const app = new App();

export default app;
