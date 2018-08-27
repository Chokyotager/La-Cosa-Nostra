module.exports = async function (message, params, config) {

  var limit = params[0] || 100;

  message.channel.send(":pushpin: Scanning... this may take a while.");

  var before = message.id;

  var arr = new Array();

  for (var i = 0; i < limit; i += 100) {
    var messages = await message.channel.fetchMessages({limit: Math.min(limit - i, 100), before: before});
    messages = messages.array();

    arr = arr.concat(messages);

    if (messages.length < 100) {
      break;
    } else {
      before = messages[99].id;
    };
  };

  var count = new Number();

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].pinned) {
      count++;
      arr[i].unpin();
    };
  };

  message.channel.send(":pushpin: Scanned **" + limit + "** message(s) and marked **" + count + "** message(s) for unpinning.");

};
