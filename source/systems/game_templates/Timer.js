// mediate the day/night cycles, set intervals

// this class is NOT meant to be serialised
var crypto = require("crypto");
var fs = require("fs");

var Game = require("./Game.js");
var Player = require("./Player.js");
var Actions = require("./Actions.js");

var auxils = require("../auxils.js");

module.exports = class {

  constructor () {

    this.day_night_mediator = null;

    // Set identifier of timer system for verification
    this.identifier = crypto.randomBytes(16).toString("hex");

  }

  init (game) {

    this.game = game;
    this.game.timer = this;

    this.ticks = 0;

    this.prime();

    this.game.timer_identifier = this.identifier;

    this.createTick();

    this.updatePresence();

    return this;

  }

  reinstantiate (game) {

    this.game = game;
    game.timer = this;

    this.ticks = 0;

    // Reprime
    this.prime();
    this.createTick();

    this.updatePresence();

    return this;

  }

  prime () {

    var current = new Date();
    var designated = this.game.next_action;

    if (this.game.state === "ended") {
      console.log("Did not prime as game has ended.");
      return null;
    };

    var delta = designated.getTime() - current.getTime();

    if (delta < 0) {

      // Recalculate
      this.game.primeDesignatedTime();

      // Alert players
      this.game.postDelayNotice();

      var delta = this.game.next_action.getTime() - current.getTime();
    };

    console.log("Primer: set D/N mediator delta to: %s", delta);

    this.designated = designated;
    this.primed = current;

    var run_as = this;

    this.clearDayNightMediator();

    this.day_night_mediator = setTimeout(function () {
      run_as.step();
    }, delta);

    // IMPORTANT: Substitute time for delta

    this.updatePresence();

  }

  async step () {

    console.log("Step fired.");
    var next_action = await this.game.step();

    // TEMP: set to not fire next step for obvious reasons


    if (next_action === null) {
      // Game ended
      this.clearDayNightMediator();
      this.updatePresence();
    } else {
      this.prime();
    };

  }

  async fastforward () {

    console.log("Fastforwarded.");
    var next_action = await this.game.step(true);

    if (next_action === null) {
      // Game ended
      this.clearDayNightMediator();
    } else {
      this.prime();
    };

  }

  tick () {

    var config = this.game.config;

    this.ticks++;

    // Autosave

    if (this.ticks % config["ticks"]["autosave-ticks"] === 0) {
      console.log("Autosaving...");
      this.save();
    };

    if (this.game.state === "pre-game" || this.game.state === "playing") {
      // Tick to update small things
      this.checkPresenceUpdate();
    };

  }

  checkPresenceUpdate () {

    var current = new Date();

    var delta = (this.designated || current).getTime() - current.getTime();

    var days = delta / (24*60*60*1000);
    var hours = delta / (60*60*1000);
    var minutes = delta / (60*1000);
    var seconds = delta / 1000;

    if (hours < 1) {
      var amount = Math.ceil(30*1000 / this.tick_time);
    } else {
      var amount = Math.ceil(5*60*1000 / this.tick_time);
    };

    if (this.ticks % amount === 0) {
      this.updatePresence();
    };

  }

  async updatePresence (stagger=800) {

    var current = new Date();

    // In milliseconds
    var delta = (this.designated || current).getTime() - current.getTime();

    if (delta < 0) {
      return null;
    };

    if (stagger) {
      await new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve();
        }, stagger);
      });
    };

    if (this.game.state === "pre-game") {

      var display = "Pre-game: " + formatDate(delta) + " left";

      await this.game.setPresence({
        status: "online",
        game: {name: display, type: "PLAYING"}
      });

    } else if (this.game.state === "playing") {

      var display = this.game.getFormattedDay() + ": " + formatDate(delta) + " left";

      await this.game.setPresence({
        status: "online",
        game: {name: display, type: "PLAYING"}
      });

    } else {

      var display = this.game.getFormattedDay() + ": game ended";

      await this.game.setPresence({
        status: "online",
        game: {name: display, type: "PLAYING"}
      });

    };

  }

  createTick (time) {

    var config = this.game.config;

    this.clearTick();

    if (time === undefined) {
      time = config["ticks"]["time"];
    };

    var run_as = this;

    this.tick_time = time;
    this.tick_interval = setInterval(async function () {
      run_as.tick();
    }, time);

  }

  destroy () {

    this.clearDayNightMediator();
    this.clearTick();

  }

  clearTick () {

    if (this.tick_interval !== undefined) {
      clearInterval(this.tick_interval);
    };

  }

  clearDayNightMediator () {

    if (this.day_night_mediator) {
      clearTimeout(this.day_night_mediator);
    };

  }

  save () {
    // Save all components

    // Clone Game instance to savable
    var savable = Object.assign({}, this.game);

    /* This one line of code below here \/ cost me TWO hours of my life
    Honestly if only Object.assign() would clone an object in its whole
    and not do a half-***ed job I would be a happier person.
    */
    savable.actions = Object.assign({}, this.game.actions);

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
    fs.writeFileSync(__dirname + "/../../../data/game_cache/game.save", encode(JSON.stringify(savable, auxils.jsonInfinityCensor)));

    // All of players class should be serialisable without deletions
    for (var i = 0; i < players.length; i++) {
      var id = players[i].identifier;

      // Duplication regardless
      // For future use if required
      var player = Object.assign({}, players[i]);

      // Guess what, I needed it after all
      delete player.game;
      delete player.role;

      var string = JSON.stringify(player, auxils.jsonInfinityCensor);

      // Saved by Discord ID
      fs.writeFileSync(__dirname + "/../../../data/game_cache/players/" + id + ".save", encode(string));
    };

    console.log("Saved game.");

    function encode (string) {
      if (config["encode-cache"]) {
        string = "encoded_base64\n" + auxils.atob(string);
      };
      return string;
    };

  };

};

module.exports.load = function (client, config) {
  // Loads
  var save = fs.readFileSync(__dirname + "/../../../data/game_cache/game.save", "utf8");

  save = decode(save);

  // Save is a game instance
  var game = new Game(client, config);
  game = Object.assign(game, save);

  // Reload all players
  var player_saves = fs.readdirSync(__dirname + "/../../../data/game_cache/players/");
  var players = new Array();

  for (var i = 0; i < player_saves.length; i++) {
    // Check for save
    if (!player_saves[i].endsWith(".save")) {
      continue;
    };

    // Reload the save
    var string = fs.readFileSync(__dirname + "/../../../data/game_cache/players/" + player_saves[i], "utf8");
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
  var outcome = game.reinstantiate(this, players);
  
  if (!outcome) {
    return null;
  };

  var timer = new module.exports().reinstantiate(game);

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

function formatDate (epoch) {
  // Format into d, h, m, s

  var days = epoch / (24*60*60*1000);
  var hours = epoch / (60*60*1000);
  var minutes = epoch / (60*1000);
  var seconds = epoch / 1000;

  if (days >= 1) {

    var ret = Math.floor(days);
    return ret + " day" + auxils.vocab("s", ret);

  } else if (hours >= 1) {

    var ret = Math.floor(hours);
    return ret + " hour" + auxils.vocab("s", ret);

  } else {

    // Deliberate
    var ret = Math.ceil(minutes);
    return ret + " minute" + auxils.vocab("s", ret);

  };

}

function decode (string) {
  var enc_test = /^encoded_base64\n/gm;

  if (enc_test.test(string)) {
    // Encoded in base64
    string = string.replace(enc_test, "");
    string = auxils.btoa(string);
  };

  return JSON.parse(string, auxils.jsonReviver);

};
