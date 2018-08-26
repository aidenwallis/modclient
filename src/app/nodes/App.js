import elements from '../elements';
import mainTemplate from '../templates/main';
import loadingTemplate from '../templates/loading';

import ChatFormNode from './ChatForm';
import ChatMessagesNode from './ChatMessages';
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

    this.loading = false;
  }

  setLoading(loading) {
    this.loading = loading;
    this.updateLoading();
  }

  updateLoading() {
    if (this.loading) {
      this.node.innerHTML = loadingTemplate;
    }
  }

  startChannel(channelName) {
    this.node.innerHTML = mainTemplate(channelName);
    this.registerChatNodes();
  }

  registerChatNodes() {
    this.nodes = {
      roomstate: new RoomstateNode(document.getElementById('chat-roomstate')),
      chatForm: new ChatFormNode(document.getElementById('chat-form')),
      messages: new ChatMessagesNode(document.getElementById('chat-messages')),
      footer: new ElementNode(document.getElementById('chat-footer')),
      settings: new SettingsButtonNode(document.getElementById('settings-button')),
    };
    elements.footer = this.nodes.footer;
  }
}

export default AppNode;
