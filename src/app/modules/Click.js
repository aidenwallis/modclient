import app from '../App';
import regexes from '../regexes';
import EventHub from './EventHub';
import TwitchKrakenClient from './TwitchKrakenClient';

class ClickModule {
  constructor(token) {
    this.token = token;
    this.bindToDocument();
  }

  bindToDocument() {
    document.addEventListener('click', (e) => {
      if (e.target.className === 'chat-line-name-inner') {
        this.handleNameClick(e);
        return;
      }
      if (e.target.classList.contains('chat-line-automod-button')) {
        this.handleAutomodResponse(e);
        return;
      }
      if (e.target.classList.contains('chat-line-mod-icon')) {
        this.handleModIcon(e);
        return;
      }
      if (e.target.classList.contains('fire-setting-action')) {
        this.handleSettingAction(e);
        return;
      }
    });
  }

  handleNameClick(e) {
    console.log(e.target.dataset.username);
  }

  handleAutomodResponse(e) {
    TwitchKrakenClient.resolveAutomod(e.target.dataset.action, e.target.dataset.msgId, this.token);
  }

  handleSettingAction(e) {
    EventHub.instance.emit('fire-setting-action', e);
  }

  handleModIcon(e) {
    const { channel, username, msgId, userId, displayName, type } = e.target.dataset;
    const arg = e.target.dataset.arg
      .replace(regexes.username, username)
      .replace(regexes.channel, channel)
      .replace(regexes.msgId, msgId)
      .replace(regexes.userId, userId)
      .replace(regexes.displayName, displayName);
    if (type == 0) {
      console.log(arg);
      app.sendMessage(arg);
    } else if (type == 1) {
      window.open(arg);
    }
  }
}

export default ClickModule;
