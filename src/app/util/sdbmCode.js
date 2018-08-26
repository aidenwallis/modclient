function sdbmCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
  }
  return Math.abs(hash);
}

export default sdbmCode;
