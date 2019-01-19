import settingModLineIconTemplate from './modLineIcon';

const settingModLineIconsTemplate = () => `
  <div class="settings-overlay-content-wrapper">
    <h1 class="settings-overlay-content-title">Mod Line Icons</h1>
    <p>Here you can define mod icons that will appear to the left of every chat message.</p>
    <p>Available arguments: <strong>{username}, {channel}, {msgId}, {userId}, {displayName}</strong></p>
    <button id="settings-overlay-content-newModIcon" class="button">Add New Mod Icon</button>
    <div id="settings-overlay-content-modIcons"></div>
  </div>
`;

export default settingModLineIconsTemplate;
