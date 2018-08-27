import escape from 'lodash/escape';

const displayNameTemplate = (name, login) => `<a href="https://twitch.tv/${escape(login)}" target="_blank" rel="noreferrer noopener" class="chat-line-usernotice-name">${escape(name)}</a>`;
const primePlugTemplate = (channel) => `<a href="https://twitch.amazon.com/prime?channel=%23${escape(channel)}&ref=subscriptionMessage" target="_blank" rel-"noopener noreferrer">Twitch Prime</a>`;

const parseSystemMsg = (message) => {
  let systemMsg = message.tags['system-msg'];
  systemMsg = systemMsg.replace(message.tags['display-name'], displayNameTemplate(message.tags['display-name'], message.tags.login));
  systemMsg = systemMsg.replace('Twitch Prime', primePlugTemplate(message.param.substring(1)));
  if (message.tags['msg-param-recipient-display-name']) {
    systemMsg = systemMsg.replace(message.tags['msg-param-recipient-display-name'], displayNameTemplate(message.tags['msg-param-recipient-display-name'], message.tags['msg-param-recipient-user-name']))
  }
  return systemMsg;
};

const usernoticeTemplate = (message) => `
  <span class="chat-line-text">${parseSystemMsg(message)}</span>
`;

export default usernoticeTemplate;
