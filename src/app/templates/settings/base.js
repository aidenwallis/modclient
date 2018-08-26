import settingsHeaderTemplate from './header';
import settingsSidebarTemplate from './sidebar';

const settingsBaseTemplate = `
  <div class="settings-overlay" id="settings-overlay">
    <div class="settings-overlay-inner">
      ${settingsHeaderTemplate}
      <div class="settings-overlay-main">
        ${settingsSidebarTemplate}
        <div id="settings-overlay-content" class="settings-overlay-content"></div>
      </div>
    </div>
  </div>
`;

export default settingsBaseTemplate;
