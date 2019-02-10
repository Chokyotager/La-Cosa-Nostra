module.exports = async function (message) {

  try {

    if (message.pinnable && !message.pinned) {

      // Create collector
      message.channel.createMessageCollector(pinFunction, {maxMatches: 3, time: 2000});

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

async function pinFunction (m) {
  // Remove the system pin message

  if (m.type === 'PINS_ADD' && m.system && !m.deleted) {

    // Delete the message
    try {

      await m.delete();
      return true;

    } catch (err) {

      return false;

    };

  } else {

    return false;

  };

}
