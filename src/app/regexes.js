const regexes = {
  space: /\s/g,
  path: /[?/]/g,
  ircSplit: /\r?\n/g,
  mention: /\b@[a-z0-9][\w]{3,24}\b/gi,
  action: /^\u0001ACTION (.*)\u0001$/,
};

export default regexes;
