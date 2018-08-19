module.exports = function (message, params, config) {
  message.channel.send(":clock: I have been online for __" + format(process.uptime()) + "__.");
};

function format(seconds) {

  // https://stackoverflow.com/questions/28705009/how-do-i-get-the-server-uptime-in-node-js

  function pad(s){
    return (s < 10 ? '0' : '') + s;
  };

  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

};
