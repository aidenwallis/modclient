import ElementNode from '../modules/ElementNode';
import SettingsNode from './Settings';


class SettingsButton extends ElementNode {
  constructor(node) {
    super(node);

    this.node.onclick = e => this.openSettings(e);
  }

  openSettings(e) {
    e.preventDefault();
    const newNode = new SettingsNode(document.getElementById('portal'));
    newNode.render();
  }
}

export default SettingsButton;
