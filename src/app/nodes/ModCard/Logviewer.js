import ElementNode from '../../modules/ElementNode';
import EventHub from '../../modules/EventHub';

class ModCardLogviewer extends ElementNode {
  constructor(node, room, channel) {
    super(node);
    this.userID = channel._id;
    this.username = channel.name;
    this.room = room;

    this.list = document.createElement('ul');
    this.list.className = 'modcard-history-list';
    this.node.appendChild(this.list);

    this.topic = `messages.new-cache.${this.userID}`;
    this.newMessage = this.newMessage.bind(this);
  }

  newMessage(text) {
    this.messages.push(text);
    this.push(text);
  }

  push(text) {
    const node = this.makeItem(text);
    const scrolledBottom = this.list.scrollTop >= (this.list.scrollHeight - this.list.offsetHeight) - 0;
    this.list.appendChild(node);
    if (scrolledBottom) {
      this.list.scrollTop = this.list.scrollHeight;
    }
  }

  makeItem(text) {
    const node = document.createElement('li');
    node.textContent = text;
    node.className = 'modcard-history-item';
    return node;
  }

  render() {
    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];
      const node = this.makeItem(message);
      this.list.appendChild(node);
    }
    this.list.scrollTop = this.list.scrollHeight;
  }

  setMessages(messages) {
    this.messages = messages;
  }

  check() {

  }

  init() {
    EventHub.instance.on(this.topic, this.newMessage);
    this.render();
  }

  unload() {
    EventHub.instance.off(this.topic, this.newMessage);
  }
}

export default ModCardLogviewer;
