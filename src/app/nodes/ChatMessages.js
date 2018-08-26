import elements from '../elements';
import ElementNode from '../modules/ElementNode';
import PubsubTimeoutNode from './PubsubTimeout';
import SettingsModule from '../modules/Settings';
import messageTemplate from '../templates/chat/message';
import noticeTemplate from '../templates/chat/notice';

class ChatMessages extends ElementNode {
  constructor(node) {
    super(node);
    this.collectedMessages = [];
    this.currentMessages = [];
    this.hoverPause = false;
    this.scrollPause = false;
    this.node.onmouseover = () => this.hoverOver();
    this.node.onmouseout = () => this.hoverOut();
    this.node.onscroll = e => this.scroll(e);
    this.statusNode = null;
    setInterval(() => this.updateMessages(), 100);
  }

  receiveMessage(message) {
    const parsedMessage = this.parseMessage(message);
    if (!parsedMessage) {
      return;
    }
    const line = document.createElement('div');
    line.className = 'chat-line';
    line.innerHTML = parsedMessage;
    line.dataset.userId = message.tags['user-id'];
    this.collectedMessages.push({
      type: 'message',
      data: message,
      node: line,
    });
  }

  parseMessage(message) {
    switch (message.command) {
      case 'PRIVMSG':
        return messageTemplate(message);
      case 'NOTICE':
        return noticeTemplate(message);
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
      }
    }
    this.node.scrollTo(0, this.node.scrollHeight);
  }

  hoverOver() {
    if (SettingsModule.settings.chat.pause.mode === 1 && !this.hoverPause) {
      this.hoverPause = true;
      if (!this.statusNode) {
        this.spawnChatStatus();
      }
    }
  }

  hoverOut() {
    if (SettingsModule.settings.chat.pause.mode === 1 && this.hoverPause) {
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
      hoverNode.onclick = () => this.node.scrollTo(0, this.node.scrollHeight);
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
      const scrolledBottom = e.target.scrollTop === (e.target.scrollHeight - e.target.offsetHeight);
      if (!scrolledBottom) {
        this.scrollPause = true;
        if (this.hoverPause) {
          this.removeStatusNode();
          this.spawnChatStatus();
        }
      } else if (this.scrollPause) {
        this.scrollPause = false;
      }
      this.checkStatusNode();
    });
  }

  receiveClearchat(message) {
    this.collectedMessages.push({
      type: 'modaction',
      data: message,
    });
  }

  receivePubsub(message) {
    switch (message.moderation_action) {
      case 'timeout':
        return this.handlePubsubTimeout(message);
      case 'ban':
        return this.handlePubsubTimeout(message);
      case 'automod_rejected':
        return this.handleAutomod(message);
      default:
        this.handlePubsubCommand(message);
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

  handleAutomod(message) {

  }

  handlePubsubCommand(message) {
  }
}

export default ChatMessages;
