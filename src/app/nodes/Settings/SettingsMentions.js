import ElementNode from '../../modules/ElementNode';
import MentionsModule from '../../modules/Mentions';
import SettingsModule from '../../modules/Settings';

import settingsMentionsTemplate from '../../templates/settings/mentions';
import settingsMentionTemplate from '../../templates/settings/mention';

const defaultNodes = {
  createButton: null,
  mentions: null,
};

class SettingsMentions extends ElementNode {
  constructor(node) {
    super(node);
    this.settings = SettingsModule.fetchSettings();
    this.nodes = defaultNodes;
  }

  render() {
    this.node.innerHTML = settingsMentionsTemplate(this.settings);
    this.registerNodes();
  }

  registerNodes() {
    this.nodes = {
      createButton: new ElementNode(document.getElementById('settings-overlay-content-newMention')),
      mentions: document.getElementById('settings-overlay-content-mentions'),
    };
    this.mountClickEvents();
    this.populateContent();
  }

  mountClickEvents() {
    this.nodes.createButton.node.onclick = e => this.createMention(e);
  }

  populateContent() {
    this.nodes.mentions.innerHTML = '';
    for (let i = 0; i < this.settings.mentions.length; i++) {
      const item = this.settings.mentions[i];
      this.nodes.mentions.appendChild(this.spawnNode(item, i));
    }
  }

  spawnNode(item, index) {
    const node = document.createElement('div');
    node.className = 'setting-item';
    node.dataset.index = index;
    node.id = `setting-item-${index}`;
    node.innerHTML = settingsMentionTemplate(item, index);
    this.mountNodeEvents(node, index, item);
    return node;
  }

  mountNodeEvents(node, index, item) {
    console.log('Mounting node events...');
    node.querySelector('.setting-item-delete').onclick = () => this.deleteMention(index);
    node.querySelector('.setting-item-type').onchange = e => this.updateMentionType(e, index, node);
    node.querySelector('.setting-item-input').onblur = e => this.updateMentionText(e, index, node);
    node.querySelector('.setting-item-enabled-control').onchange = e => this.updateMentionEnabled(e, index, node);
  }

  deleteMention(index) {
    this.settings.mentions = this.settings.mentions.filter((_, i) => i !== index);
    SettingsModule.updateSettings(this.settings);
    this.populateContent();
    MentionsModule.updateMentions(this.settings.mentions);
  }

  updateMentionType(e, index, node) {
    this.settings.mentions[index].type = e.target.value;
    SettingsModule.updateSettings(this.settings);
    node.innerHTML = settingsMentionTemplate(this.settings.mentions[index]);
    this.mountNodeEvents(node, index);
    MentionsModule.updateMentions(this.settings.mentions);
  }

  updateMentionText(e, index, node) {
    this.settings.mentions[index].text = e.target.value;
    SettingsModule.updateSettings(this.settings);
    node.innerHTML = settingsMentionTemplate(this.settings.mentions[index]);
    this.mountNodeEvents(node, index);
    MentionsModule.updateMentions(this.settings.mentions);
  }

  updateMentionEnabled(e, index, node) {
    this.settings.mentions[index].enabled = !!e.target.checked;
    SettingsModule.updateSettings(this.settings);
    node.innerHTML = settingsMentionTemplate(this.settings.mentions[index]);
    this.mountNodeEvents(node, index);
    MentionsModule.updateMentions(this.settings.mentions);
  }

  createMention(e) {
    e.preventDefault();
    const instance = {
      type: 0,
      text: '',
      enabled: true,
    };
    this.nodes.mentions.appendChild(this.spawnNode(instance, this.settings.mentions.length));
    this.settings.mentions.push(instance);
    SettingsModule.updateSettings(this.settings);
  }

  unmount() {

  }
}

export default SettingsMentions;
