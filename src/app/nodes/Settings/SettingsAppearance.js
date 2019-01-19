import ElementNode from '../../modules/ElementNode';
import SettingsModule from '../../modules/Settings';
import settingsAppearanceTemplate from '../../templates/settings/appearance';
import discoverInputs from '../../util/discoverInputs';

const defaultNodes = {
  form: null,
};

class SettingsAppearanceNode extends ElementNode {
  constructor(node) {
    super(node);
    this.settings = SettingsModule.fetchSettings();
    this.nodes = defaultNodes;
    this.submit = this.submit.bind(this);
  }

  render() {
    this.settings = SettingsModule.fetchSettings();
    this.node.innerHTML = settingsAppearanceTemplate(this.settings);
    this.nodes = {
      form: new ElementNode(document.getElementById('settings-overlay-form')),
    };
    this.registerNodes();
  }

  unmount() {
    this.unregisterNodes();
  }

  registerNodes() {
    this.nodes.form.node.addEventListener('submit', this.submit);
  }

  unregisterNodes() {
    this.nodes.form.node.removeEventListener('submit', this.submit);
  }

  submit(e) {
    e.preventDefault();
    const inputs = discoverInputs(this.nodes.form.node);
    this.settings.appearance = inputs;
    SettingsModule.updateSettings(this.settings);
  }
}

export default SettingsAppearanceNode;
