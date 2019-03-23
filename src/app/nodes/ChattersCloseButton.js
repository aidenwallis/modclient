import ElementNode from '../modules/ElementNode';

class ChattersCloseButton extends ElementNode {
  constructor(node, close) {
    super(node);

    this.node.className = 'chatters-close';
    this.node.innerHTML = '<i class="fa fa-times"></i>';
    this.node.title = 'Close chatters list';
    this.node.onclick = () => close();
  }
}

export default ChattersCloseButton;
