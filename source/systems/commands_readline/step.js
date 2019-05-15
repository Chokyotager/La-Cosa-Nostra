module.exports = async function (client, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    console.log(":No game in progress.");
    return null;
  };

  process.timer.step();
  console.log("Step set.");

};
