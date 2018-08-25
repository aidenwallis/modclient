function transformBadges(badges) {
  const badgeSplit = badges.split(',');
  return badgeSplit.reduce((acc, cur) => {
    const [key, val] = cur.split('/');
    acc[key] = val;
    return acc;
  }, {});
}

export default transformBadges;
