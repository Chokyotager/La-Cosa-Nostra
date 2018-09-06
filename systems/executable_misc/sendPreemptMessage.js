var auxils = require("./../auxils.js");

module.exports = async function (player, successes) {

  successes = successes.map(x => "**" + x.getDisplayName() + "**");

  await player.getPrivateChannel().send(":open_file_folder: Your pre-emptive vote" + auxils.vocab("s", successes.length) + " against " + auxils.pettyFormat(successes) + " " + auxils.vocab("has", successes.length) + " been executed.");

};
