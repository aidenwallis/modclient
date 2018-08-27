import chatIconsTemplate from './icons';
import messageTemplate from './message';
// prefix: data.args[0],
//     trailing: data.args[1],
//     tags: {
//       badges: '',
//       'display-name': data.args[0],
//     },
const automodTemplate = (data) => `
  ${chatIconsTemplate()}
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
