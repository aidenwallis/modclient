import escape from 'lodash/escape';

const noticeTemplate = (message) => `<span class="chat-line-notice">${escape(message.trailing)}</span>`;

export default noticeTemplate;
