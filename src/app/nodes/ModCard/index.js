import app from '../../App';
import ElementNode from '../../modules/ElementNode';
import TwitchHelixClient from '../../modules/TwitchHelixClient';
import modcardHeaderTemplate from '../../templates/modcard/header';
import LogviewerClient from '../../modules/LogviewerClient';
import TwitchKrakenClient from '../../modules/TwitchKrakenClient';

import ModCardChatHistory from './ChatHistory';
import ModCardNavigation from './Navigation';
import EventHub from '../../modules/EventHub';
import ModcardUsernameChangelog from './UsernameChangelog';
import ModCardLogviewer from './Logviewer';

import getMonth from '../../util/getMonth';
import parseIRCMessage from '../../util/parseIRCMessage';

const logviewerClient = new LogviewerClient();

class ModCard extends ElementNode {
  constructor(login, channel) {
    super(document.createElement('div'));
    this.login = login;
    this.channel = channel;

    this.headerNode = document.createElement('div');
    this.node.appendChild(this.headerNode);

    this.navNode = new ModCardNavigation(document.createElement('ul'), i => this.updateNav(i));
    this.node.appendChild(this.navNode.node);

    this.contentNode = document.createElement('div');
    this.contentNode.className = 'modcard-content';
    this.node.appendChild(this.contentNode);

    this.closeNode = document.createElement('button');
    this.closeNode.onclick = e => this.close(e);
    this.closeNode.className = 'modcard-close';
    this.closeNode.innerHTML = '<i class="fa fa-times"></i>';
    this.node.appendChild(this.closeNode);

    this.items = null;

    this.initX = 0;
    this.initY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.hoverActive = false;

    this.currentIndex = 0;

    this.node.onmousedown = e => this.onMouseDown(e);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.node.onmouseup = e => this.onMouseUp(e);

    this.node.ontouchstart = e => this.onTouchStart(e);
    this.node.ontouchmove = e => this.onTouchMove(e);

    this.node.className = 'modcard';
    this.portalNode = document.getElementById('portal');
  }

  unload() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  spawn() {
    const item = this.items[this.navNode.currentIndex];
    item.init();
    this.contentNode.appendChild(item.node);
    this.portalNode.appendChild(this.node);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  updateNav(index, currentIndex) {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    this.items[this.currentIndex].unload();
    this.contentNode.innerHTML = '';
    this.currentIndex = index;
    const item = this.items[index];
    item.init();
    this.contentNode.appendChild(item.node);
  }

  close(e) {
    e.preventDefault();
    this.items[this.navNode.currentIndex].unload();
    this.portalNode.removeChild(this.node);
    app.removeModCard(this.login);
  }

  renderWithID(id) {
    return TwitchKrakenClient.fetchChannelByID(id)
      .then((channel) => {
        this.headerNode.innerHTML = modcardHeaderTemplate(channel);
        this.items = {
          0: new ModCardChatHistory(document.createElement('div'), channel),
          1: new ModcardUsernameChangelog(document.createElement('div'), channel.name),
          2: new ModCardLogviewer(document.createElement('div'), this.channel, channel),
        };
        this.queryLogviewer(channel.name);
        this.spawn();
      });
  }

  queryLogviewer(username) {
    logviewerClient.fetchLogs(username, this.channel)
      .then((data) => {
        const messages = data.before.map((message) => {
          const date = new Date(message.time * 1000);
          let final = `${('00' + date.getDate()).substr(2)}/${getMonth(date.getMonth(), true)}/${date.getFullYear().toString().substr(2)} `;
          final += `${('00' + date.getHours()).substr(2)}:${('00' + date.getMinutes()).substr(2)}: `;
          final += parseIRCMessage(message.text).trailing;
          return final;
        });
        this.items[2].setMessages(messages);
        this.navNode.setLogviewer(true);
      })
      .catch((err) => {
        console.error(err);
        this.navNode.setLogviewer(false)
      });
  }

  render() {
    TwitchHelixClient.fetchUserID(this.login)
      .then((id) => {
        if (!id) {
          throw new Error('User not found');
        }
        return this.renderWithID(id);
      })
      .catch((err) => {
        alert(`User "${this.login}" was not found!`)
      });
  }

  onMouseDown(e) {
    // e.preventDefault();
    this.hoverActive = true;
    this.initX = e.clientX - this.xOffset;
    this.initY = e.clientY - this.yOffset;
    EventHub.instance.emit('lock.hover', true);
  }

  onMouseUp(e) {
    this.hoverActive = false;
    EventHub.instance.emit('lock.hover', false);
    this.initX = this.currentX;
    this.initY = this.currentY;
  }

  onMouseMove(e) {
    if (!this.hoverActive) {
      return;
    }
    e.preventDefault();
    this.currentX = e.clientX - this.initX;
    this.currentY = e.clientY - this.initY;
    this.xOffset = this.currentX;
    this.yOffset = this.currentY;
    this.node.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
  }

  onTouchStart(e) {
    e.preventDefault();
    this.initX = e.target.offsetLeft;
    this.initY = e.target.offsetTop;
  }

  onTouchMove(e) {
    const touch = e.touches[0];
    this.node.style.left = `${e.clientX - this.initX}px`;
    this.node.style.top = `${e.clientY - this.initY}px`;
  }
}

export default ModCard;
