import escape from 'lodash/escape';
import SettingsModule from '../../modules/Settings';
const iconTemplate = icon => `<i class="fa fa-${icon}"></i>`;

const chatIconsTemplate = (channel, username, msgId, userId, displayName) => SettingsModule.settings.modLineIcons.map((item) => `
  <button
    class="chat-line-mod-icon${item.labelType == 1 ? ' chat-line-mod-icon-text' : ''}"
    data-type="${item.type}"
    data-arg="${item.query}"
    data-channel="${escape(channel)}"
    data-username="${escape(username)}"
    data-msg-id="${escape(msgId)}"
    data-user-id="${escape(userId)}"
    data-display-name="${escape(displayName)}"
  >
    ${item.labelType == 0 ? iconTemplate(item.iconLabel) : item.textLabel}
  </button>
`).join('');

const chatIconsWrapper = (...args) => `
  <span class="chat-line-mod-icons">
    ${chatIconsTemplate(...args)}
  </span>
`;

export default chatIconsWrapper;
