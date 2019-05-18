var AdvancedBot = require("./AdvancedBot.js");

module.exports = class extends AdvancedBot {

  constructor () {

    super(...arguments);

    this.stdio_options = ["inherit", "inherit", "inherit", "ipc"];

  }

};
