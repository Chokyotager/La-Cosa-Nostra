module.exports = function formatUTCDate (date) {

  date = new Date(date);

  var day = date.getUTCDate();
  var month = date.toLocaleString("en-gb", { month: "long" });
  var year = date.getUTCFullYear();

  var hours = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours();
  var minutes = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes();

  var formatted = day + " " + month + " " + year + " UTC " + hours + ":" + minutes;

  return formatted;
};
