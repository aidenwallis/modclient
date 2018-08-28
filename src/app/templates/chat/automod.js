import chatIconsTemplate from './icons';
import messageTemplate from './message';
// prefix: data.args[0],
//     trailing: data.args[1],
//     tags: {
//       badges: '',
//       'display-name': data.args[0],
//     },chatIconsTemplate(message.param.substring(1), escapedUsername, message.tags.id, message.tags['user-id'], escapedDisplayName)
const automodTemplate = (data, channel, channelID) => `
  ${chatIconsTemplate(channel, data.args[0], data['msg-id'], data.target_user_id, data.args[0])}
  <span class="chat-line-automod">
    <button class="chat-line-automod-button chat-line-automod-button-deny" data-msg-id="${data.msg_id}" data-action="deny">
      <i class="fa fa-fw fa-times"></i>
    </button>
    <button class="chat-line-automod-button chat-line-automod-button-approve" data-msg-id="${data.msg_id}" data-action="approve">
      <i class="fa fa-check fa-fw"></i>
    </button>
  </span>
  ${messageTemplate({
    prefix: data.args[0],
    trailing: data.args[1],
    tags: {
      badges: '',
      'display-name': data.args[0],
    },
  })}
  <span class="chat-line-automod-reason">&mdash; Reason: (${data.args[2]})</span>
`;

export default automodTemplate;
