import chatHeaderTemplate from './chat/header';
import chatFooterTemplate from './chat/footer';

const mainTemplate = (channel) => `
  <div id="modcard-portal"></div>
  <div class="chat-layout">
    ${chatHeaderTemplate(channel)}
    <div id="chat-messages"></div>
    ${chatFooterTemplate}
  </div>
`;

export default mainTemplate;
