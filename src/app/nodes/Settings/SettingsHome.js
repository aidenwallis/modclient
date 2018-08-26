import ElementNode from '../../modules/ElementNode';
import SettingsModule from '../../modules/Settings';
import settingsHomeTemplate from '../../templates/settings/home';

class SettingsHomeNode extends ElementNode {
  constructor(node) {
    super(node);
    this.settings = SettingsModule.fetchSettings();
  }

  render() {
    this.settings = SettingsModule.fetchSettings();
    this.node.innerHTML = settingsHomeTemplate(this.settings);
  }

  unmount() {

  }
}

export default SettingsHomeNode;
