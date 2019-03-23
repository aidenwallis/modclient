import ChattersNode from './ChattersNode';
import ElementNode from '../modules/ElementNode';

class ChattersButton extends ElementNode {
  constructor(node, channel) {
    super(node);

    this.channel = channel;
    this.node.onclick = e => this.openChatters(e);
  }

  openChatters(e) {
    e.preventDefault();
    const newNode = new ChattersNode(document.getElementById('chatters'), this.channel);
    newNode.render();
  }
}

export default ChattersButton;
