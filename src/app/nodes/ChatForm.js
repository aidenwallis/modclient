import app from '../App';
import regexes from '../regexes';
import ElementNode from '../modules/ElementNode';
import EventHub from '../modules/EventHub';
import CustomapiBackendClient from '../modules/CustomapiBackendClient';

const customapiClient = new CustomapiBackendClient();

class ChatForm extends ElementNode {
  constructor(node, channelName) {
    super(node);

    this.input = new ElementNode(document.getElementById('chat-input'));

    this.input.node.onkeypress = e => this.inputKeypress(e);
    this.input.node.onfocus = () => this.resetTabTries();
    this.input.node.onkeydown = e => this.inputKeydown(e);
    this.node.onsubmit = e => this.formSubmit(e);

    this.channel = channelName;

    EventHub.instance.on('message.new', (m) => this.storeUser(m));
    this.fetchChatterList();
    setInterval(() => this.fetchChatterList(), 30 * 60 * 1000);

    this.tabTries = -1;
    this.userList = new Set();
  }

  submit(e) {
    e.preventDefault();
    this.processMessage();
  }

  resetTabTries() {
    this.tabTries = -1;
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

  inputKeydown(e) {
    if (e.keyCode === 9) {
      this.handleInputTab(e);
      return;
    }
  }

  handleInputTab(e) {
    e.preventDefault();
    const caretPos = this.input.node.selectionStart;
    const text = this.input.node.value;

    if (text.replace(regexes.space, '') === '') {
      return;
    }

    const before = text.substring(0, caretPos);
    const after = text.substring(caretPos);

    const firstSlice = before.split(' ');
    const firstSection = firstSlice[firstSlice.length - 1]; // first part of word

    const secondSlice = after.split(' ');
    const secondSection = secondSlice[0] || '';

    if (firstSection === '' && secondSection === '') {
      return;
    }

    const searchWord = `${firstSection}${secondSection}`;


  }

  fetchChatterList() {
    customapiClient.fetchChatters(this.channel)
      .then((chatters) => {
        this.userList = new Set(chatters);
        console.log(this.userList.size);
      })
      .catch((e) => console.error(e));
  }

  storeUser(m) {
    const username = m.prefix.split('!')[0];
    const displayName = m.tags['display-name'];
    this.userList.add(username === displayName.toLowerCase() ? displayName : username);
  }
}

export default ChatForm;
