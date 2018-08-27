import assign from 'lodash/assign';

const defaultSettings = {
  chat: {
    pause: {
      mode: 1, // 0 = disabled, 1 = hover, 2 = ctrl
    },
  },
  appearance: {
    css: null,
    chatLines: false,
  },
  modLineIcons: [{
    type: 0,
    labelType: 0,
    iconLabel: 'ban',
    query: '.ban {username}',
  } ,{
    type: 0,
    labelType: 0,
    iconLabel: 'clock-o',
    query: '.timeout {username} 600',
  }],
};

class SettingsModule {
  constructor() {
    this.settings = defaultSettings;
    this.fetchSettings = this.fetchSettings.bind(this);
    this.customCSSNode = null;
  }

  fetchSettings() {
    let settings = localStorage.getItem('settings');
    if (settings) {
      settings = JSON.parse(settings);
    } else {
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
      settings = defaultSettings;
    }
    this.settings = assign({}, defaultSettings, settings);
    this.pushChanges();
    return settings;
  }

  updateSettings(newSettings) {
    this.settings = assign({}, this.settings, newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
    this.pushChanges();
    return newSettings;
  }

  spawnCSSNode() {
    const node = document.createElement('link');
    node.rel = 'stylesheet';
    node.href = this.settings.appearance.css;
    this.customCSSNode = node;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  pushChanges() {
    if (this.settings.appearance.chatLines) {
      document.body.classList.add('setting-chat-chatlines');
    } else {
      document.body.classList.remove('setting-chat-chatlines');
    }
    if (this.settings.appearance.css) {
      if (this.customCSSNode && this.customCSSNode.src !== this.settings.appearance.css) {
        if (this.customCSSNode) {
          this.customCSSNode.parentNode.removeChild(this.customCSSNode);
        }
        this.spawnCSSNode();
      } else if (!this.customCSSNode) {
        this.spawnCSSNode();
      }
    } else if (this.customCSSNode) {
      this.customCSSNode.parentNode.removeChild(this.customCSSNode);
    }
  }
}

export default new SettingsModule();

function removeElement(node) {
  node.parentNode.removeChild(node);
}
