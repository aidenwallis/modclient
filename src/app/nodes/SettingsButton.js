import ElementNode from '../modules/ElementNode';

class SettingsButton extends ElementNode {
  constructor(node) {
    super(node);

    this.node.onclick = () => this.openSettings();
  }

  openSettings() {
    console.log('open settings');
  }
}

export default SettingsButton;
