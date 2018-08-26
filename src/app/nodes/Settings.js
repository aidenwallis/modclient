import ElementNode from '../modules/ElementNode';
import settingsBaseTemplate from '../templates/settings/base';
import SettingsCloseNode from './SettingsClose';

import SettingsAppearanceNode from './Settings/SettingsAppearance';
import SettingsHomeNode from './Settings/SettingsHome';
import SettingsModLineIconsNode from './Settings/SettingsModLineIcons';

const defaultNodes = {
  close: null,
};

class SettingsNode extends ElementNode {
  constructor(node) {
    super(node);
    this.open = false;
    this.nodes = defaultNodes;
    this.currentSection = 'home';
    this.linkClick = this.linkClick.bind(this);
    this.sections = {
      home: null,
      appearance: null,
      modLineIcons: null,
    };
  }

  render() {
    this.open = true;
    this.node.innerHTML = settingsBaseTemplate;
    this.registerNodes();
    const contentNode = document.getElementById('settings-overlay-content');
    this.sections = {
      home: new SettingsHomeNode(contentNode),
      appearance: new SettingsAppearanceNode(contentNode),
      modLineIcons: new SettingsModLineIconsNode(contentNode),
    };
    this.changeSection('home');
  }

  registerNodes() {
    this.nodes = {
      close: new SettingsCloseNode(document.getElementById('settings-overlay-header-close')),
      links: document.querySelectorAll('.settings-overlay-sidebar-link'),
    };
    for (let i = 0; i < this.nodes.links.length; i++) {
      this.nodes.links[i].addEventListener('click', this.linkClick);
    }
    this.nodes.close.node.onclick = e => this.close(e);
  }

  close(e) {
    e.preventDefault();
    this.open = false;
    this.unregisterNodes();
    this.node.innerHTML = '';
  }

  unregisterNodes() {
    for (let i = 0; i < this.nodes.links.length; i++) {
      this.nodes.links[i].removeEventListener('click', this.linkClick);
    }
    this.nodes = defaultNodes;
  }

  linkClick(e) {
    e.preventDefault();
    if (e.target.dataset.to === this.currentSection) {
      return;
    }
    this.changeSection(e.target.dataset.to);
  }

  changeSection(section) {
    if (!this.sections[section]) {
      return;
    }
    this.sections[this.currentSection].unmount();
    this.currentSection = section;
    this.sections[section].render();
    for (let i = 0; i < this.nodes.links.length; i++) {
      this.nodes.links[i].classList.remove('settings-overlay-sidebar-link-active');
    }
    document.querySelector(`.settings-overlay-sidebar-link[data-to="${section}"]`).classList.add('settings-overlay-sidebar-link-active');
  }
}

export default SettingsNode;
