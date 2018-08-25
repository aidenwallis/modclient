import escape from 'lodash/escape';
import regexes from '../../regexes';
import badgeTemplate from './badge';
import BadgesModule from '../../modules/Badges';

const intlNameTemplate = (name) => `<span class="chat-line-name-intl-login"> (${name})</span>`;

// this emote formatting i found by alca, props to him!
function renderText(message, emotes) {
  const characterArray = Array.from(message);
  for (let i = 0; i < emotes.length; i++) {
    const emote = emotes[i];
    const emoteName = characterArray.slice(emote.start, emote.end + 1).join('');
    characterArray[emote.start] = `<img class="chat-line-emote chat-line-emote-${emote.id} chat-line-twitch-emote" data-provider="twitch" title="${emoteName}" src="https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0">`;
    for (let k = emote.start + 1; k <= emote.end; k++) {
      characterArray[k] = '';
    }
  }
  return characterArray.join('');
}

function messageTemplate(message) {
  const badges = message.tags.badges.split(',')
    .map((b) => {
      const split = b.split('/');
      return { name: split[0], version: split[1] };
    })
    .map((b) => {
      if (BadgesModule.channelBadges[b.name]) {
        return BadgesModule.channelBadges[b.name].versions[b.version];
      }
      if (BadgesModule.globalBadges[b.name]) {
        return BadgesModule.globalBadges[b.name].versions[b.version];
      }
      return null;
    })
    .filter(b => b)
    .map((badge) => badgeTemplate(badge))
    .join('');
  const emotes = [];
  if (message.tags.emotes) {
    const emoteLists = message.tags.emotes.split('/');
    for (let i = 0; i < emoteLists.length; i++) {
      const [emoteId, _positions] = emoteLists[i].split(':');
      const positions = _positions.split(',');
      for (let j = 0; j < positions.length; j++) {
        const [start, end] = positions[j].split('-');
        emotes.push({
          start: parseInt(start),
          end: parseInt(end),
          id: emoteId,
        });
      }
    }
  }

  const escapedUsername = escape(message.prefix.split('!')[0]);
  const escapedDisplayName = escape(message.tags['display-name']);
  const intlName = escapedDisplayName.toLowerCase() !== escapedUsername;
  return `
    <span class="chat-line-badges">${badges}</span>
    <span class="chat-line-name">
      <span class="chat-line-name-inner" data-username="${escapedUsername}" style="color: ${message.tags.color}">${escapedDisplayName}${intlName ? intlNameTemplate(escapedUsername) : ''}</span><span class="chat-line-colon">:</span>
    </span>
    <span class="chat-line-text">${renderText(escape(message.trailing), emotes)}</span>
  `;
}

export default messageTemplate;
