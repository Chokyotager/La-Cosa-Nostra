module.exports = function (milliseconds) {

  var seconds = Math.floor(milliseconds/1000) % 60;
  var minutes = Math.floor(milliseconds/(1000*60)) % 60;
  var hours = Math.floor(milliseconds/(1000*60*60)) % 24;
  var days = Math.floor(milliseconds/(1000*60*60*24)) % 7;
  var weeks = Math.floor(milliseconds/(1000*60*60*24*7));

  // Calculate
  var concat = new String();

  if (weeks >= 1) {
    concat += weeks + "w ";
  };

  if (days >= 1) {
    concat += days + "d ";
  };

  if (hours >= 1) {
    concat += hours + "h ";
  };

  if (minutes >= 1) {
    concat += minutes + "min ";
  };

  if (seconds >= 1) {
    concat += seconds + "s";
  };

  return concat.trim();

};
