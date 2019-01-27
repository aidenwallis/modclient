import escape from 'lodash/escape';

const settingsApparancePage = (settings) => `
  <div class="settings-overlay-content-wrapper">
    <h1 class="settings-overlay-content-title">Appearance</h1>
    <form id="settings-overlay-form">
      <div class="form-group">
        <label for="css">Custom stylesheet URL:</label>
        <input type="url" placeholder="Entire CSS URL here." class="input" name="css" value="${escape(settings.appearance.css || '')}">
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" name="chatLines" value="1"${settings.appearance.chatLines ? ' checked' : ''}> Add lines in between chat messages.
        </label>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" name="fixNameColor" value="1"${settings.appearance.fixNameColor !== false ? ' checked' : ''}> Try to make sure name colors are always readable.
        </label>
      </div>
      <button class="button" type="submit">Save</button>
    </form>
  </div>
`;

export default settingsApparancePage;
