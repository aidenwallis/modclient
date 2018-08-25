import ElementNode from '../modules/ElementNode';
import SettingsModule from '../modules/Settings';
import messageTemplate from '../templates/chat/message';
import noticeTemplate from '../templates/chat/notice';

class ChatMessages extends ElementNode {
  constructor(node) {
    super(node);
    this.collectedMessages = [];
    this.paused = false;
    this.node.onmouseover = () => this.hoverOver();
    this.node.onmouseout = () => this.hoverOut();
    this.node.onscroll = e => this.scroll(e);
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
    this.collectedMessages.push(line);
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
    if (this.paused) {
      return;
    }
    for (let i = 0; i < this.collectedMessages.length; i++) {
      this.node.appendChild(this.collectedMessages[i]);
      if (i === this.collectedMessages.length - 1) {
        this.collectedMessages = [];
        const childLength = this.node.children.length;
        if (childLength > 300) {
          const toRemove = childLength - 300;
          for (let j = 0; j < toRemove; j++) {
            this.node.removeChild(this.node.childNodes[0]);
          }
        }
      }
    }
    this.node.scrollTo(0, this.node.scrollHeight);
  }

  hoverOver() {
    if (SettingsModule.settings.chat.pause.mode === 1) {
      this.pauseChat('chat hover');
    }
  }

  hoverOut() {
    if (SettingsModule.settings.chat.pause.mode === 1) {
      this.unpauseChat();
    }
  }

  pauseChat(reason = 'hover') {
    this.paused = true;
  }

  scroll(e) {
    const scrolledBottom = e.target.scrollTop === (e.target.scrollHeight - e.target.offsetHeight);
    if (!scrolledBottom) {
      this.pauseChat();
    } else {
      this.unpauseChat();
    }
  }

  unpauseChat() {
    this.paused = false;
  }
}

export default ChatMessages;
