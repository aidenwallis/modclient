import escape from 'lodash/escape';
import getMonth from '../../util/getMonth';

const modcardHeaderTemplate = (channel) => {
  const name = escape(channel.display_name.toLowerCase() === channel.name ? channel.display_name : channel.name);
  const creation = new Date(channel.created_at);
  const banner = channel.profile_banner || 'https://static.twitchcdn.net/assets/bg_glitch_pattern-34ca2e369aad1ed33b57.png';
  return `
    <header class="modcard-header">
      <img src="${channel.logo}" alt="${name}' s avatar" class="modcard-header-avatar">
      <div class="modcard-header-content">
        <h3 class="modcard-header-name">${name}</h3>
        <p class="modcard-header-birthday">
          <i class="fa fa-birthday-cake" aria-hidden="true"></i>
          Created on ${creation.getDate()} ${getMonth(creation.getMonth(), true)} ${creation.getFullYear()}
        </p>
      </div>
      <div class="modcard-header-bg" style="background-image: url(${banner})"></div>
    </header>
  `;
};

export default modcardHeaderTemplate;
