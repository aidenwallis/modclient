import ElementNode from '../../modules/ElementNode';
import EventHub from '../../modules/EventHub';
import SettingsModule from '../../modules/Settings';
import settingsModLineIconTemplate from '../../templates/settings/modLineIcon';
import settingsModLineIconsTemplate from '../../templates/settings/modLineIcons';
import settingModLineIconTemplate from '../../templates/settings/modLineIcon';
import iconSelector from '../../templates/settings/iconSelector';

const defaultNodes = {
  createButton: null,
};

class SettingsModLineIconsNode extends ElementNode {
  constructor(node) {
    super(node);
    this.settings = SettingsModule.fetchSettings();
    this.nodes = defaultNodes;
    this.settingAction = this.settingAction.bind(this);
  }

  render() {
    this.settings = SettingsModule.fetchSettings();
    this.node.innerHTML = settingsModLineIconsTemplate(this.settings);
    this.registerNodes();
  }

  registerNodes() {
    this.nodes = {
      createButton: new ElementNode(document.getElementById('settings-overlay-content-newModIcon')),
      modIcons: document.getElementById('settings-overlay-content-modIcons'),
    };
    this.mountClickEvents();
    this.populateContent();
    EventHub.instance.on('fire-setting-action', this.settingAction);
  }

  mountClickEvents() {
    this.nodes.createButton.node.onclick = e => this.createModIcon(e);
  }

  createModIcon(e) {
    e.preventDefault();
    const instance = {
      type: 0,
      query: '',
      labelType: 0,
      textLabel: '',
      iconLabel: '',
    };
    this.nodes.modIcons.appendChild(this.spawnNode(instance, this.settings.modLineIcons.length));
    this.settings.modLineIcons.push(instance);
    SettingsModule.updateSettings(this.settings);
  }

  populateContent() {
    this.nodes.modIcons.innerHTML = '';
    for (let i = 0; i < this.settings.modLineIcons.length; i++) {
      const item = this.settings.modLineIcons[i];
      this.nodes.modIcons.appendChild(this.spawnNode(item, i));
    }
  }

  spawnNode(item, index) {
    const node = document.createElement('div');
    node.className = 'setting-mod-line-icon';
    node.dataset.index = index;
    node.id = `setting-mod-line-icon-${index}`;
    node.innerHTML = settingModLineIconTemplate(item);
    this.mountNodeEvents(node, index, item);
    return node;
  }

  mountNodeEvents(node, index, item) {
    node.querySelector('.setting-mod-line-icon-type').onchange = e => this.changeModIconType(e, index);
    node.querySelector('.setting-mod-line-icon-input').onblur = e => this.changeModIconQuery(e, index);
    node.querySelector('.setting-mod-line-icon-labeltype').onchange = e => this.changeModIconLabeltype(e, index, node);
    if (item.type === 1) {
      node.querySelector('.setting-mod-line-icon-label-input').onblur = e => this.changeModIconLabel(e, index, item);
    }
    node.querySelector('.setting-mod-line-icon-up').onclick = e => this.moveModIcon(e, index, -1);
    node.querySelector('.setting-mod-line-icon-down').onclick = e => this.moveModIcon(e, index, 1);
    node.querySelector('.setting-mod-line-icon-delete').onclick = e => this.deleteModIcon(index);
    if (item.type == 0) {
      node.querySelector('button.setting-mod-line-icon-icon-preview').onclick = e => this.openModIconSelector(e, index, item);
    }
  }

  openModIconSelector(e, index, item) {
    const parentNode = e.target.parentNode;
    if (parentNode.classList.contains('icon-selector-open')) {
      return;
    }
    parentNode.classList.add('icon-selector-open');

    const selectorNode = document.createElement('div');
    selector.className = 'setting-mod-line-icon-selector-container';
    selectorNode.innerHTML = iconSelectorTemplate(item.iconLabel);
    parentNode.appendChild(selectorNode);
  }

  moveModIcon(e, index, amount) {
    const moveTo = index + amount;
    if (!this.settings.modLineIcons[moveTo]) {
      return;
    }
    const current = this.settings.modLineIcons[index];
    const newPos = this.settings.modLineIcons[moveTo];
    this.settings.modLineIcons[index] = newPos;
    this.settings.modLineIcons[moveTo] = current;
    SettingsModule.updateSettings(this.settings);
    this.populateContent();
  }

  deleteModIcon(index) {
    this.settings.modLineIcons = this.settings.modLineIcons.filter((_, i) => i !== index);
    SettingsModule.updateSettings(this.settings);
    this.populateContent();
  }

  changeModIconLabeltype(e, index, node) {
    this.settings.modLineIcons[index].labelType = e.target.value;
    SettingsModule.updateSettings(this.settings);
    node.innerHTML = settingModLineIconTemplate(this.settings.modLineIcons[index]);
    this.mountNodeEvents(node, index);
  }

  changeModIconLabel(e, index, item) {
    if (item.labelType == 0) {
      this.settings.modLineIcons[index].iconLabel = e.target.value;
    } else if (item.labelType == 1) {
      this.settings.modLineIcons[index].textLabel = e.target.value;
    }
    SettingsModule.updateSettings(this.settings);
  }

  changeModIconType(event, index) {
    this.settings.modLineIcons[index].type = event.target.value;
    SettingsModule.updateSettings(this.settings);
  }

  changeModIconQuery(event, index) {
    this.settings.modLineIcons[index].query = event.target.value;
    SettingsModule.updateSettings(this.settings);
  }

  unmount() {
    EventHub.instance.removeListener('fire-setting-action', this.settingAction);
  }

  settingAction(event) {
    console.log(event);
  }
}

export default SettingsModLineIconsNode;
