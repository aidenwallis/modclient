import app from '../App';
import regexes from '../regexes';
import BTTVModule from '../modules/BTTV';
import EmotesModule from '../modules/Emotes';
import ElementNode from '../modules/ElementNode';
import EventHub from '../modules/EventHub';
import FFZModule from '../modules/FFZ';
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
    this.startIndex = -1;
    this.endIndex = -1;
    this.caretPos = -1;
    this.userList = new Set();
    this.query = '';
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
    // if is a tab key pressed
    if (e.keyCode === 9) {
      if (this.tabTries === -1) {
        this.query = e.target.value;
      }
      this.handleInputTab(e);
      return false;
    }
    this.tabTries = -1;
    if (this.suggestions) {
      this.suggestions = null;
    }
    this.startIndex = -1;
    this.endIndex = -1;
    this.caretPos = this.input.node.selectionStart;
    this.query = e.target.value;
  }

  handleInputTab(e) {
    e.preventDefault();
    const caretPos = this.caretPos;
    const text = this.query;

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
    console.log(searchWord, before, after, firstSlice, secondSection);

    if (this.startIndex === -1) {
      this.startIndex = caretPos - (firstSection.length);
      this.endIndex = caretPos + secondSection.length;
    }

    if (!this.suggestions) {
      this.suggestions = this.fetchSuggestions(searchWord);
    }

    if (this.suggestions.length > 0) {
      this.tabTries++;
      if (this.tabTries > this.suggestions.length) {
        this.tabTries = 0;
      }
      const isMention = searchWord[0] === '@';
      let start = this.startIndex;
      if (isMention) {
        start++;
      }
      const val = Array.from(text);
      const suggestion = this.suggestions[this.tabTries];
      if (!suggestion) {
        return;
      }
      val[start] = suggestion;
      for (let i = start + 1; i < this.endIndex; i++) {
        val[i] = '';
      }
      this.input.node.value = val.filter(i => i).join('');
      this.input.node.selectionEnd = this.caretPos;
      this.input.node.setSelectionRange(this.startIndex, this.startIndex + suggestion.length + (isMention ? 1 : 0));
    }
  }

  fetchSuggestions(query) {
    const includeEmotes = query[0] !== '@';
    const q = (query[0] === '@' ? query.substring(1) : query).toLowerCase();
    const userArray = Array.from(this.userList).filter(u => u.toLowerCase().startsWith(q));
    let emoteArray = [];
    if (includeEmotes) {
      emoteArray = [
        ...EmotesModule.userEmotesText.filter(e => e.toLowerCase().startsWith(q)),
        ...BTTVModule.emotes.filter(e => e.toLowerCase().startsWith(q)),
        ...FFZModule.emotes.filter(e => e.toLowerCase().startsWith(q)),
      ]
    }
    const finalArray = [...userArray, ...emoteArray].sort();
    return finalArray;
  }

  fetchChatterList() {
    customapiClient.fetchChatters(this.channel)
      .then((chatters) => {
        this.userList = new Set(chatters);
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
