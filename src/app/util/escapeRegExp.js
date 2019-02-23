import regexes from '../regexes';

function escapeRegExp(pattern) {
  return pattern.replace(regexes.escapeRegexes, '\\$&');
}

export default escapeRegExp;
