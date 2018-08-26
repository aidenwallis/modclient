import escape from 'lodash/escape';

const noticeTemplate = (message) => `<span class="chat-line-notice">${escape(message)}</span>`;

export default noticeTemplate;
