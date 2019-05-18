module.exports = async function (message, params, config) {

  var version_info = process.version_info;

  var update_name = version_info["update-name"];
  var version = version_info["version"];

  var repository = version_info.repository.url;

  await message.channel.send(":sunflower: This bot is running on **" + update_name + " La Cosa Nostra " + version + "**.\nThe bot repository is located at <" + repository + ">.");

};
