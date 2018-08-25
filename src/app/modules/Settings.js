const defaultSettings = {
  chat: {
    pause: {
      mode: 1, // 0 = disabled, 1 = hover, 2 = ctrl
    },
  },
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
    return settings;
  }
}

export default new SettingsModule();
