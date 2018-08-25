import assign from 'lodash/assign';

import elements from './elements';
import regexes from './regexes';

import AppNode from './nodes/App';
import BadgesModule from './modules/Badges';
import ClickModule from './modules/Click';
import EmotesModule from './modules/Emotes';
import SettingsModule from './modules/Settings';

import TwitchAuthClient from './modules/TwitchAuthClient';
import TwitchHelixClient from './modules/TwitchHelixClient';
import TwitchConnection from './modules/TwitchConnection';

const authClient = new TwitchAuthClient();
const helixClient = new TwitchHelixClient();

class App {
  constructor() {
    this.receiverConnection = null;
    this.sendConnection = null;
    this.currentRoomstate = {};
    this.app = new AppNode(document.getElementById('app'));
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
    const { oauthToken } = localStorage;
    authClient.validateToken(oauthToken, (err, payload) => {
      console.log(err, payload);
      if (err || !payload || !payload.user_id) {
        localStorage.removeItem('oauthToken');
        this.start();
        return;
      }
      Promise.all([
        BadgesModule.fetchGlobalBadges(),
        BadgesModule.fetchChannelBadges(channelID),
        EmotesModule.fetchGlobalTwitchEmotes(payload.user_id, oauthToken),
      ]).then((res) => {
        const [globalBadges, channelBadges] = res;
        console.log(globalBadges, channelBadges);
        this.connect(payload.login, localStorage.oauthToken, channelName, channelID);
        new ClickModule();
      })
      .catch((err) => {
        console.error('error while loading badges', err);
      })
    });
  }

  connect(username, password, channelName, channelID) {
    this.receiverConnection = new TwitchConnection(username, password, channelName, channelID);
    this.sendConnection = new TwitchConnection(username, password, null, null);
    Promise.all([
      this.receiverConnection.connect(),
      this.sendConnection.connect(),
    ])
    .then(() => {
      this.app.startChannel(channelName);
    });
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
      const messages = this.app.nodes.messages.node.querySelectorAll(`[data-user-id="${message.tags['target-user-id']}"`);
      for (let i = 0; i < messages.length; i++) {
        messages[i].classList.add('chat-line-deleted');
      }
    });
    this.receiverConnection.on('PRIVMSG', (message) => this.handleMessage(message));
    this.receiverConnection.on('USERNOTICE', (message) => this.handleMessage(message));
    this.receiverConnection.on('NOTICE', (message) => this.handleMessage(message));
  }

  handleMessage(message) {
    if (!this.app.nodes.messages) {
      return;
    }
    this.app.nodes.messages.receiveMessage(message);
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
