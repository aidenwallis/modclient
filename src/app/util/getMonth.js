const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getMonth(month, short = false) {
  const foundMonth = months[month];
  if (!foundMonth) {
    return 'Unknown';
  }
  return short ? foundMonth.slice(0, 3) : foundMonth;
}

export default getMonth;
