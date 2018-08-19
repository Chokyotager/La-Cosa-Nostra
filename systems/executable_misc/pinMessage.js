module.exports = async function (message) {

  if (message.pinnable && !message.pinned) {

    // Create collector
    message.channel.createMessageCollector(pinFunction, {maxMatches: 1, time: 1000});

    await message.pin();

    return true;

  };

  return false;

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
