import regexes from '../regexes';

import AlertNode from '../node-types/Alert';
import ElementNode from '../modules/ElementNode';

class SelectChannel extends ElementNode {
  constructor(node) {
    super(node);

    this.form = new ElementNode(document.getElementById('channel-form'));
    this.alert = new AlertNode(document.getElementById('channel-form-alert'));
    this.channelInput = new ElementNode(document.getElementById('channel-input'));
  }

  prepare() {
    this.form.node.onsubmit = (e) => {
      e.preventDefault();
      this.alert.close();
      const channelName = this.channelInput.node.value.toLowerCase();
      if (channelName.replace(regexes.space, '') === '') {
        this.alert.showMessage('Please enter a channel name!');
        return;
      }
      window.location = `/${channelName}`;
      console.log('submit!', channelName);
    };
  }
}

export default SelectChannel;
