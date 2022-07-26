exports.getBeginningOfTheDay = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.toISOString();
};

exports.getBeginningOfTheWeek = () => {
  const now = new Date();
  const days = (now.getDay() + 7 - 1) % 7;
  now.setDate(now.getDate() - days);
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
};

exports.getBeginningOfTheMonth = () => {
  var date = new Date();
  var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDayOfMonth.toISOString();
};

exports.getBeginningOfTheYear = () => {
  var date = new Date();
  var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  return firstDayOfYear.toISOString();
};
