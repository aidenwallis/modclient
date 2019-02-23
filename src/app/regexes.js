const regexes = {
  space: /\s/g,
  path: /[?/]/g,
  ircSplit: /\r?\n/g,
  mention: /\b@[a-z0-9][\w]{3,24}\b/gi,
  action: /^\u0001ACTION (.*)\u0001$/,
  username: /{username}/g,
  channel: /{channel}/g,
  msgId: /{msgId}/g,
  userId: /{userId}/g,
  displayName: /{displayName}/g,
  prefixCheck: /^(?:[a-zA-Z]+:)?\/\//,
  bitMatch: /^(\w+?)(\d+)$/,
  color: /^#[A-F0-9]+$/i,
  colorGlobal: /^#[A-F0-9]+$/gi,
  notColorGlobal: /[^A-F0-9]/gi,
  escapeRegexes: /[-[\]{}()*+?.,\\^$|#\s]/g,
};

export default regexes;
