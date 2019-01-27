import escape from 'lodash/escape';
import getMonth from '../../util/getMonth';

const modcardUsernamesTemplate = (usernames) => {
  let content;
  if (!usernames.length) {
    content = `<li class="modcard-history-item">No username changes found.</li>`;
  } else {
    content = usernames.map((u) => {
      const date = new Date(u.found_at);
      return `
        <li class="modcard-history-item">
          ${date.getDate()} ${getMonth(date.getMonth(), true)} ${date.getFullYear()}: ${escape(u.username_old)}
        </li>
      `;
    }).join('');
  }
  return `
    <ul class="modcard-history-list">
      ${content}
    </ul>
  `;
};

export default modcardUsernamesTemplate;
