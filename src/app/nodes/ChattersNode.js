import CustomapiBackendClient from '../modules/CustomapiBackendClient';
import ElementNode from '../modules/ElementNode';

import loadingTemplate from '../templates/loading';
import ChattersCloseButton from './ChattersCloseButton';

const backendApi = new CustomapiBackendClient();

class ChattersNode extends ElementNode {
  constructor(node, username) {
    super(node);
    this.username = username;
    this.innerNode = document.createElement('ul');
    this.innerNode.className = 'chatters-list';
    this.closeNode = new ChattersCloseButton(document.createElement('button'), () => this.close());
    this.node.appendChild(this.closeNode.node);
  }

  render() {
    this.addClass('visible');
    this.renderLoading();
    backendApi.fetchChattersList(this.username)
      .then((chatters) => {
        this.renderChatters(chatters);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  close() {
    this.removeClass('visible');
    this.node.innerHTML = '';
  }

  renderChatters(chatters) {
    this.node.innerHTML = '';
    this.node.appendChild(this.closeNode.node);
    this.node.appendChild(this.innerNode);
    console.log(chatters);
    this.makeHeader('Staff', chatters.staff.length);
    for (const user of chatters.staff) {
      this.makeEntry(user);
    }

    this.makeHeader('Admins', chatters.admins.length);
    for (const user of chatters.admins) {
      this.makeEntry(user);
    }

    this.makeHeader('Moderators', chatters.moderators.length);
    for (const user of chatters.moderators) {
      this.makeEntry(user);
    }

    this.makeHeader('Viewers', chatters.viewers.length);
    for (const user of chatters.viewers) {
      this.makeEntry(user);
    }
  }

  makeHeader(name, entries) {
    const listNode = document.createElement('li');
    listNode.textContent = `${name} (${entries})`;
    listNode.className = 'chatters-list-header';
    this.innerNode.appendChild(listNode);
  }

  makeEntry(user) {
    const listNode = document.createElement('li');
    listNode.className = 'chatters-list-item';
    const anchorNode = document.createElement('a');
    anchorNode.href = `https://twitch.tv/${user}`;
    anchorNode.target = '_blank';
    anchorNode.rel = 'noopener noreferrer';
    anchorNode.textContent = user;
    listNode.appendChild(anchorNode);
    this.innerNode.appendChild(listNode);
  }

  renderError() {
    this.node.innerHTML = 'An error occurred while fetching chatters';
    this.node.appendChild(this.closeNode.node);
  }

  renderLoading() {
    this.node.innerHTML = loadingTemplate('overlay-chatters');
    this.node.appendChild(this.closeNode.node);
  }
}

export default ChattersNode;
