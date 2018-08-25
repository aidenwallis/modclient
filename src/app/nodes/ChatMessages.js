import ElementNode from '../modules/ElementNode';
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
    this.recentTimeouts = {};
    setInterval(() => this.updateMessages(), 200);
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
    if (this.recentTimeouts[message.tags['user-id']]) {
      delete this.recentTimeouts[message.tags['user-id']];
    }
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
      default:
        return null;
    }
  }

  updateMessages() {
    if (this.hoverPause || this.scrollPause) {
      return;
    }
    for (let i = 0; i < this.collectedMessages.length; i++) {
      let message = this.collectedMessages[i];
      this.node.appendChild(message.node);
      this.currentMessages.push(message)
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
      }
    }
    this.node.scrollTo(0, this.node.scrollHeight);
  }

  hoverOver() {
    if (SettingsModule.settings.chat.pause.mode === 1) {
      this.hoverPause = true;
    }
  }

  hoverOut() {
    if (SettingsModule.settings.chat.pause.mode === 1) {
      this.hoverPause = false;
    }
  }

  scroll(e) {
    const scrolledBottom = e.target.scrollTop === (e.target.scrollHeight - e.target.offsetHeight);
    if (!scrolledBottom) {
      this.scrollPause = true;
    } else if (this.scrollPause) {
      this.scrollPause = false;
    }
  }
}

export default ChatMessages;
