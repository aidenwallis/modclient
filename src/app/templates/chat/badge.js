const badgeTemplate = (badge) => `
  <span class="chat-badge">
    <img src="${badge.image_url_1x}" alt="${badge.title}" height="18" class="chat-line-badge">
  </span>
`;

export default badgeTemplate;
