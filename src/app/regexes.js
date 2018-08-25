const regexes = {
  space: /\s/g,
  path: /[?/]/g,
  ircSplit: /\r?\n/g,
  mention: /\b@[a-z0-9][\w]{3,24}\b/gi,
};

export default regexes;
