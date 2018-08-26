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
  modLineIcons: [],
};

class SettingsModule {
  constructor() {
    this.settings = defaultSettings;
    this.fetchSettings = this.fetchSettings.bind(this);
  }

  fetchSettings() {
    let settings = localStorage.getItem('settings');
    if (settings) {
      settings = JSON.parse(settings);
    } else {
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
      settings = defaultSettings;
    }
    this.settings = settings;
    this.pushChanges();
    return settings;
  }

  updateSettings(newSettings) {
    this.settings = newSettings;
    localStorage.setItem('settings', JSON.stringify(newSettings));
    this.pushChanges();
    return newSettings;
  }

  pushChanges() {
    if (this.settings.appearance.chatLines) {
      document.body.classList.add('setting-chat-chatlines');
    } else {
      document.body.classList.remove('setting-chat-chatlines');
    }
  }
}

export default new SettingsModule();
