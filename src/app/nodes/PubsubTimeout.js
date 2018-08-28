import ElementNode from '../modules/ElementNode';

class PubsubTimeoutNode extends ElementNode {
  constructor(data) {
    super();
    this.data = data;
    this.node = document.createElement('div');
    this.node.className = 'chat-line chat-line-mod-action';
    this.noticeNode = document.createElement('span');
    this.noticeNode.className = 'chat-line-notice';
    this.node.appendChild(this.noticeNode);
    this.times = 1;
    this.noticeNode.textContent = this.generateMessage();
  }

  update() {
    this.noticeNode.textContent = this.generateMessage();
  }

  generateMessage() {
    let text = '';
    text += this.data.created_by;
    text += ' ';
    text += this.data.moderation_action === 'timeout' ? 'timed out' : 'banned';
    text += ' ';
    text += this.data.args[0];
    if (this.data.moderation_action === 'timeout') {
      text += ' for ';
      text += this.data.args[1];
      text += ` second${this.data.args[1] != 1 ? 's' : ''}`;
    }
    text += '.';
    if (this.data.args[2]) {
      text += ' Reason: ';
      text += this.data.args[2];
    }
    if (this.times > 1) {
      text += ` (${this.times} times)`;
    }
    return text;
  }
}

export default PubsubTimeoutNode;
