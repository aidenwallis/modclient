const chatFooterTemplate = (channel) => `
  <div id="chat-footer" class="chat-footer">
    <form id="chat-form">
      <div class="chat-form">
        <textarea id="chat-input" class="chat-input" placeholder="Enter a message..."></textarea>
      </div>
      <div class="chat-bottom">
        <button id="settings-button" class="chat-bottom-button" title="Modclient Settings"><i class="fa fa-cog fa-fw"></i></button>
        <a target="_blank" class="chat-bottom-button" title="Chatter list" href="https://twitchstuff.3v.fi/chatters/?ch=${channel}" rel="noopener noreferrer">
          <i class="fa fa-list fa-fw"></i>
        </a>
      </div>
    </form>
  </div>
`;

export default chatFooterTemplate;
