const roomstateItemTemplate = (value, type) => `
  <span class="chat-roomstate-tag chat-roomstate-tag-${type}">${value}</span>
`;

const buildFollowersText = val => val > 0 ? `: ${val}m` : '';

function chatRoomstateTemplate(tags) {
  let element = '';
  if (tags['broadcaster-lang'] && tags['broadcaster-lang'] !== '') {
    element += roomstateItemTemplate(`LANG: ${tags['broadcaster-lang']}`, 'lang');
  }
  if (tags['emote-only'] && tags['emote-only'] > 0) {
    element += roomstateItemTemplate('<i class="fa fa-smiley"></i> Emoteonly');
  }
  if (tags['followers-only'] && tags['followers-only'] > -1) {
    element += roomstateItemTemplate(`FOLLOWERS${buildFollowersText(tags['followers-only'])}`, 'followers');
  }
  if (tags.r9k && tags.r9k > 0) {
    element += roomstateItemTemplate('R9K', 'r9k');
  }
  if (tags.slow && tags.slow > 0) {
    element += roomstateItemTemplate(`SLOW: ${tags.slow}`, 'slow');
  }
  if (tags['subs-only'] && tags['subs-only'] > 0) {
    element += roomstateItemTemplate('SUBS', 'subs');
  }
  return element;
}

export default chatRoomstateTemplate;

