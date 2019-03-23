const settingsMentionsTemplate = (settings) => `
  <div class="settings-overlay-content-wrapper">
    <h1 class="settings-overlay-content-title">Mentions</h1>
    <p>Customise how users are able to mention you in chat, their mentions will appear as red highlighted messages.</p>
    <p>We automatically highlight messages that contain your username in them.</p>
    <button id="settings-overlay-content-newMention" class="button">Add New Mention</button>
    <div id="settings-overlay-content-mentions"></div>
  </div>
`;

export default settingsMentionsTemplate;
