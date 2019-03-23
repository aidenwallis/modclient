import elements from '../elements';
import mainTemplate from '../templates/main';
import loadingTemplate from '../templates/loading';

import ChatFormNode from './ChatForm';
import ChatMessagesNode from './ChatMessages';
import ChattersButtonNode from './ChattersButton';
import ElementNode from '../modules/ElementNode';
import RoomstateNode from './Roomstate';
import SettingsButtonNode from './SettingsButton';

class AppNode extends ElementNode {
  constructor(node) {
    super(node);

    this.nodes = {
      roomstate: null,
      messages: null,
    };

    this.user = null;
    this.channel = null;
    this.loading = false;
  }

  setLoading(loading) {
    this.loading = loading;
    this.updateLoading();
  }

  setChannel(channel) {
    this.channel = channel;
  }

  updateLoading() {
    if (this.loading) {
      this.node.innerHTML = loadingTemplate();
    }
  }

  setUser(user) {
    this.user = user;
    if (this.nodes.messages) {
      this.nodes.messages.setUser(user);
    }
  }

  startChannel(channelName) {
    this.node.innerHTML = mainTemplate(channelName);
    this.registerChatNodes(channelName);
  }

  registerChatNodes(channelName) {
    this.nodes = {
      roomstate: new RoomstateNode(document.getElementById('chat-roomstate')),
      chatForm: new ChatFormNode(document.getElementById('chat-form'), channelName),
      messages: new ChatMessagesNode(document.getElementById('chat-messages'), this.user),
      footer: new ElementNode(document.getElementById('chat-footer')),
      settings: new SettingsButtonNode(document.getElementById('settings-button')),
      chatters: new ChattersButtonNode(document.getElementById('chatters-button'), this.channel),
    };
    elements.footer = this.nodes.footer;
  }
}

export default AppNode;
