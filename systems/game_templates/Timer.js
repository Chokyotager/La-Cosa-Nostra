// mediate the day/night cycles, set intervals

// this class is NOT meant to be serialised
var crypto = require("crypto");
var fs = require("fs");

var Game = require("./Game.js");
var Player = require("./Player.js");
var Actions = require("./Actions.js")

module.exports = class {

  constructor () {

    this.day_night_mediator = null;

    // Set identifier of timer system for verification
    this.identifier = crypto.randomBytes(16).toString("hex");

  }

  init (game) {

    this.game = game;
    this.game.timer = this;

    this.prime();

    this.game.timer_identifier = this.identifier;

    this.createAutosave();

    return this;

  }

  reinstantiate (game) {

    this.game = game;
    game.timer = this;

    return this;

  }

  prime () {

    var current = new Date();
    var designated = this.game.next_action;

    var delta = designated.getTime() - current.getTime();
    console.log("Primer: set D/N mediator delta to: %s", delta);

    var run_as = this;

    this.day_night_mediator = setTimeout(function () {
      run_as.step();
    }, 10000);

    // IMPORTANT: Substitute time for delta

  }

  async step () {

    console.log("Step fired.");
    var next_action = await this.game.step();

    // TEMP: set to not fire next step for obvious reasons


    if (next_action === null) {
      // Game ended
      this.clearDayNightMediator();
    } else {
      this.prime();
    };

  }

  createAutosave () {

    var timer = this;

    this.autosave = setInterval(async function () {
      console.log("Autosaving...");
      timer.save();
    }, 5*60*1000);

  }

  destroy () {
    this.clearDayNightMediator();
    this.clearAutosave();
  }

  clearAutosave () {

    clearInterval(this.autosave);

  }

  clearDayNightMediator () {
    clearTimeout(this.day_night_mediator);
  }

  save () {
    // Save all components

    // Clone Game instance to savable
    var savable = Object.assign({}, this.game);

    var players = savable.players;
    var config = savable.config;

    // Remove non-serialisable components
    delete savable.temp;
    delete savable.client;
    delete savable.config;
    delete savable.timer;

    delete savable.actions.game;

    delete savable.players;

    savable.saved_at = new Date();

    // Save object
    fs.writeFileSync(__dirname + "/../../game_cache/game.save", encode(JSON.stringify(savable)));

    // All of players class should be serialisable without deletions
    for (var i = 0; i < players.length; i++) {
      var id = players[i].identifier;

      // Duplication regardless
      // For future use if required
      var player = Object.assign({}, players[i]);

      // Guess what, I needed it after all
      delete player.game;

      var string = JSON.stringify(player);

      // Saved by Discord ID
      fs.writeFileSync(__dirname + "/../../game_cache/players/" + id + ".save", encode(string));
    };

    console.log("Saved game.");

    function encode (string) {
      if (config["encode-cache"]) {
        string = "encoded_base64\n" + atob(string);
      };
      return string;
    };

  };

};

module.exports.load = function (client, config) {
  // Loads
  var save = fs.readFileSync(__dirname + "/../../game_cache/game.save", "utf8");

  save = decode(save);

  // Save is a game instance
  var game = new Game(client, config);
  game = Object.assign(game, save);

  // Reload all players
  var player_saves = fs.readdirSync(__dirname + "/../../game_cache/players/");
  var players = new Array();

  for (var i = 0; i < player_saves.length; i++) {
    // Check for save
    if (!player_saves[i].endsWith(".save")) {
      continue;
    };

    // Reload the save
    var string = fs.readFileSync(__dirname + "/../../game_cache/players/" + player_saves[i], "utf8");
    player_save = decode(string);

    var player = new Player();

    player = Object.assign(player, player_save);

    // Reinstantiation of players in Game instance

    players.push(player);

  };

  var actions = new Actions();
  game.actions = Object.assign(actions, game.actions);

  // Sort the players array in alphabetical order
  players.sort(function (a, b) {
    return charCounter(a.alphabet) - charCounter(b.alphabet);
  });

  // Reinstantiate deleted properties
  game.reinstantiate(this, players);

  var timer = new module.exports().reinstantiate(game);

  // Reprime
  timer.prime();
  timer.createAutosave();

  return timer;

  function charCounter (string) {
    var sum = new Number();

    for (var i = 0; i < string.length; i++) {
      // Multiply by big prime number
      // to reduce chances of collision
      sum += string.charCodeAt(i) * 1300921;
    };

    return sum;
  };

};

function decode (string) {
  var enc_test = /^encoded_base64\n/gm;

  if (enc_test.test(string)) {
    // Encoded in base64
    string = string.replace(enc_test, "");
    string = btoa(string);
  };

  return JSON.parse(string, dateTimeReviver);

  function dateTimeReviver (key, value) {

    var date_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/g;

    if (typeof value === "string" && date_format.test(value)) {

      return new Date(value);
    };

    return value;

  };

};

function atob (string) {
  return Buffer.from(string).toString("base64");
};

function btoa (string) {
  return Buffer.from(string, "base64").toString("utf8");
};
