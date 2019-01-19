import ElementNode from '../modules/ElementNode';

class PubsubDelete extends ElementNode {
  constructor(data) {
    super(data);
    this.data = data;
    this.node = document.createElement('div');
    this.node.className = 'chat-line chat-line-mod-action';
    this.noticeNode = document.createElement('span');
    this.noticeNode.className = 'chat-line-notice';
    this.node.appendChild(this.noticeNode);
    this.noticeNode.textContent = this.generateMessage();
    this.revealerNode = document.createElement('a');
    this.revealerNode.onclick = e => this.revealMessage(e);
    this.revealerNode.className = 'chat-line-revealer';
    this.revealerNode.textContent = '<click to show>';
    this.noticeNode.appendChild(this.revealerNode);
  }

  generateMessage() {
    let text = this.data.created_by;
    text += ' deleted ';
    text += this.data.args[0];
    text += '\'s message: ';
    return text;
  }

  generateRevealer() {

  }

  revealMessage(e) {
    e.preventDefault();
    this.revealerNode.onclick = null;
    this.revealerNode.classList.add('chat-line-revealed');
    this.revealerNode.textContent = this.data.args[1];
  }
}

export default PubsubDelete;
