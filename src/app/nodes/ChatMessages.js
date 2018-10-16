import elements from '../elements';
import ElementNode from '../modules/ElementNode';
import PubsubTimeoutNode from './PubsubTimeout';
import SettingsModule from '../modules/Settings';
import messageTemplate from '../templates/chat/message';
import noticeTemplate from '../templates/chat/notice';
import automodTemplate from '../templates/chat/automod';
import usernoticeTemplate from '../templates/chat/usernotice';

class ChatMessages extends ElementNode {
  constructor(node) {
    super(node);
    this.collectedMessages = [];
    this.currentMessages = [];
    this.hoverPause = false;
    this.activeChatlines = null;
    this.scrollPause = false;
    this.node.onmouseover = () => this.hoverOver();
    this.node.onmouseout = () => this.hoverOut();
    this.node.onscroll = e => this.scroll(e);
    this.statusNode = null;
    setInterval(() => this.updateMessages(), 100);
  }

  receiveMessage(message, isMod = false) {
    const parsedMessage = this.parseMessage(message, isMod);
    if (!parsedMessage) {
      return;
    }
    this.pushMessageToBuffer(parsedMessage, message);
  }

  parseMessage(message, isMod = false) {
    switch (message.command) {
      case 'PRIVMSG':
        return messageTemplate(message, isMod);
      case 'NOTICE':
        return noticeTemplate(message.trailing);
      case 'CLEARCHAT':
        return clearchatTemplate(message);
      default:
        return null;
    }
  }

  updateMessages() {
    if (this.hoverPause || this.scrollPause) {
      return;
    }
    const clearchats = [];
    for (let i = 0; i < this.collectedMessages.length; i++) {
      let message = this.collectedMessages[i];
      if (message.type === 'modaction') {
        clearchats.push(message);
      } else if (message.type === 'pubsub_timeout') {
        this.node.appendChild(message.node.node);
      } else {
        this.node.appendChild(message.node);
      }
      this.currentMessages.push(message);
      if (i === this.collectedMessages.length - 1) {
        this.collectedMessages = [];
        const childLength = this.node.children.length;
        if (childLength > 300) {
          const toRemove = childLength - 300;
          for (let j = 0; j < toRemove; j++) {
            this.node.removeChild(this.node.childNodes[0]);
            this.currentMessages.shift();
          }
        }
        for (let j = 0; j < clearchats.length; j++) {
          const messages = this.node.querySelectorAll(`[data-user-id="${clearchats[j].data.tags['target-user-id']}"`);
          for (let i = 0; i < messages.length; i++) {
            messages[i].classList.add('chat-line-deleted');
          }
        }
        this.node.scrollTop = this.node.scrollHeight;
      }
    }
  }

  hoverOver() {
    if (SettingsModule.settings.chat.pause.mode === 1) {
      this.hoverPause = true;
      if (!this.statusNode) {
        this.spawnChatStatus();
      }
    }
  }

  hoverOut() {
    if (SettingsModule.settings.chat.pause.mode === 1) {
      this.hoverPause = false;
    }
    this.checkStatusNode();
  }

  spawnChatStatus() {
    if (!elements.footer) {
      return;
    }
    const hoverNode = document.createElement('div');
    hoverNode.className = 'chat-status';
    let reason;
    if (this.scrollPause) {
      reason = 'More messages below';
      hoverNode.classList.add('clickable');
      hoverNode.onclick = () => this.node.scrollTo(0, this.node.scrollHeight + 10000);
    } else if (this.hoverPause) {
      reason = '(Chat paused due to user action)';
    } else {
      reason = 'Why the fuck am I paused? Report this to Aiden.';
    }
    hoverNode.textContent = reason;
    elements.footer.node.appendChild(hoverNode);
    this.statusNode = hoverNode;
  }

  checkStatusNode() {
    if (!this.scrollPause && !this.hoverPause && this.statusNode) {
      this.removeStatusNode();
    }
  }

  removeStatusNode() {
    this.statusNode.parentNode.removeChild(this.statusNode);
    this.statusNode = null;
  }

  scroll(e) {
    window.requestAnimationFrame(() => {
      const scrolledBottom = e.target.scrollTop >= (e.target.scrollHeight - e.target.offsetHeight) - 100;
      // const scrolledBottom = e.target.scrollTop === (e.target.scrollHeight - e.target.offsetHeight);
      if (!scrolledBottom) {
        this.scrollPause = true;
        if (this.hoverPause) {
          this.removeStatusNode();
        }
        this.spawnChatStatus();
      } else if (this.scrollPause) {
        this.scrollPause = false;
      }
      this.checkStatusNode();
    });
  }

  markActiveChatLinesDirty() {
    this.activeChatlines = null;
  }

  receiveClearchat(message, isMod = false) {
    this.collectedMessages.push({
      type: 'modaction',
      data: message,
    });
    if (!isMod) {
      let text = '';
      text += message.trailing;
      text += ' has been ';
      text += message.tags['ban-duration'] ? 'timed out' : 'banned';
      if (message.tags['ban-duration']) {
        text += ' for ';
        text += `${message.tags['ban-duration']} second${message.tags['ban-duration'] != 1 ? 's' : ''}`;
      }
      text + '.';
      if (message.tags['ban-reason'] !== '') {
        text += ' Reason: ';
        text += message.tags['ban-reason'];
      }
      this.pushMessageToBuffer(noticeTemplate(text), message);
    }
  }

  receivePubsub(message, channel, channelID) {
    switch (message.moderation_action) {
      case 'timeout':
        return this.handlePubsubTimeout(message, channel, channelID);
      case 'ban':
        return this.handlePubsubTimeout(message, channel, channelID);
      case 'automod_rejected':
        return this.handleAutomod(message, channel, channelID);
      default:
        this.handlePubsubCommand(message, channel, channelID);
        break;
    }
  }

  handlePubsubTimeout(data) {
    const pubsubKey = `${data.created_by_user_id}.${data.target_user_id}`;
    const [i, type, message] = this.findExistingModlog(pubsubKey);
    if (message) {
      message.node.data = data;
      message.node.times++;
      message.node.update();
      if (type === 0) {
        this.collectedMessages[i] = message;
      } else if (type === 1) {
        this.currentMessages[i] = message;
      }
    } else {
      this.collectedMessages.push({
        type: 'pubsub_timeout',
        node: new PubsubTimeoutNode(data),
        pubsubKey: pubsubKey,
      });
    }
  }

  findExistingModlog(key) {
    for (let i = 0; i < this.collectedMessages.length; i++) {
      let message = this.collectedMessages[i];
      if (message.type === 'pubsub_timeout' && message.pubsubKey === key) {
        return [i, 0, message];
      }
    }
    for (let i = 0; i < this.currentMessages.length; i++) {
      let message = this.currentMessages[i];
      if (message.type === 'pubsub_timeout' && message.pubsubKey === key) {
        return [i, 1, message];
      }
    }
    return [null, null, null];
  }

  handleAutomod(message, channel, channelID) {
    this.pushMessageToBuffer(automodTemplate(message, channel, channelID, true), message);
  }

  handlePubsubCommand(message) {
    const text = `${message.created_by} used command: /${message.moderation_action}${message.args ? ' ' + message.args.join(' ') : ''}`;
    this.pushMessageToBuffer(noticeTemplate(text), message);
  }

  pushMessageToBuffer(node, message, type = 'message') {
    const line = document.createElement('div');
    line.className = 'chat-line';
    line.innerHTML = node;
    if (message.tags && message.tags['user-id']) {
      line.dataset.userId = message.tags['user-id'];
    }
    this.collectedMessages.push({
      type: 'message',
      data: message,
      node: line,
    });
  }

  receiveUsernotice(message) {
    const line = document.createElement('div');
    line.className = 'chat-line chat-line-usernotice';
    line.innerHTML = usernoticeTemplate(message);
    line.dataset.userId = message.tags['user-id'];
    this.collectedMessages.push({
      type: 'message',
      data: message,
      node: line,
    });
  }
}

export default ChatMessages;
