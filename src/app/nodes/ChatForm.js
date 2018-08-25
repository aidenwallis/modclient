import app from '../App';
import regexes from '../regexes';
import ElementNode from '../modules/ElementNode';

class ChatForm extends ElementNode {
  constructor(node) {
    super(node);

    this.input = new ElementNode(document.getElementById('chat-input'));

    this.input.node.onkeypress = e => this.inputKeypress(e);
    this.node.onsubmit = e => this.formSubmit(e);
  }

  submit(e) {
    e.preventDefault();
    this.processMessage();
  }

  processMessage() {
    const message = this.input.node.value;
    this.input.node.value = '';
    if (message.replace(regexes.space, '') === '') {
      return;
    }
    app.sendMessage(message);
  }

  inputKeypress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.processMessage();
    }
  }
}

export default ChatForm;
