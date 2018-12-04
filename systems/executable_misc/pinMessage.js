module.exports = async function (message) {

  try {

    if (message.pinnable && !message.pinned) {

      // Create collector
      message.channel.createMessageCollector(pinFunction, {maxMatches: 1, time: 2000});

      // Await
      await new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve();
        }, 200);
      });

      await message.pin();

      return true;

    };

  } catch (err) {

    // Suppress error
    return false;

  } finally {

    return false;

  };

};

function pinFunction (m) {
  // Remove the system pin message

  if (m.type === 'PINS_ADD' && m.system) {

    // Delete the message
    m.delete();
    return true;

  } else {

    return false;

  };

}
