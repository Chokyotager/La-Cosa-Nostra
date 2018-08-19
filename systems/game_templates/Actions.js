// Stores all the executable actions

var actionables = require("../actionables.js"); // for now
var crypto = require("crypto");
var Player = require("./Player.js");

module.exports = class {

  constructor () {

  }

  init (game) {
    this.actions = new Array();
    this.previous = new Array();
    this.game = game;

    return this;
  }

  add (identifier, triggers, options) {

    // Actions are calculated relative to the step

    var allowed = ["cycle", "chat", "lynch", "nightkilled", "attacked", "killed"];

    for (var i = 0; i < triggers.length; i++) {
      if (!allowed.includes(triggers[i])) {
        var err = "Unknown trigger " + triggers[i] + ".";
        throw new Error(err);
      };
    };

    var actionable = options;

    actionable.id = crypto.randomBytes(4).toString("hex");
    actionable.identifier = identifier;
    actionable.triggers = triggers;

    actionable.priority = actionable.priority || 0;

    if (actionable.from instanceof Player) {
      actionable.from = actionable.from.id;
    };

    if (actionable.to instanceof Player) {
      actionable.to = actionable.to.id;
    };

    /*
    var actionable = {
      id: crypto.randomBytes(4).toString("hex"),
      name: name,
      from: from,
      to: to,
      priority: priority,
      identifier: identifier,
      expiry: expiry,
      execution: execution,
      trigger: ["cycle"]
    };*/

    // triggers: cycle, chat, lynch, nightkilled, attacked

    this.actions.push(actionable);

    return actionable;

  }

  sortByPriority (shuffle_first=false) {

    if (shuffle_first) {
      this.actions = shuffle(this.actions);
    };

    this.actions.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }

  step () {
    // Iterate through actions
    this.execute("cycle");
  }

  // "params" is optional
  execute (type, params, check_expiries=true) {

    // Actions: [from, to, game]
    // Returns: boolean
    // If true for chat, lynch, nightkilled types, subtract one
    // from expiration

    this.sortByPriority(true);

    for (var i = 0; i < this.actions.length; i++) {

      var action = this.actions[i];

      if (action.triggers.includes(type)) {
        // Execute action
        var run = actionables[action.identifier];

        if (run === undefined) {
          console.warn("Bad function in actions!");
          continue;
        };

        var result = run(action, this.game, params);

        if (result && ["chat", "lynch", "nightkill", "attacked", "killed"].includes(type)) {
          // Decrement
          action.expiry--;
        };

      };

      if (check_expiries) {
        this.expiration();
      };


    };


  }

  reinstantiate (game) {
    this.game = game;
  }

  expiration () {
    // Check expiries, remove
    for (var i = 0; i < this.actions.length; i++) {
      if (this.actions[i].expiry <= 0) {
        // Remove
        this.previous.push(this.actions[i]);
        this.actions.splice(i, 1);
      };
    };
  }

};

function shuffle (x) {
  // Using standard Fisher-Yates shuffling
  // Copied from CAH :P

  // Array is duplicated
  ret = Array.from(x);

  for (var i = 0; i < ret.length; i++) {
    var jumble = Math.floor(Math.random() * i);
    var cache = ret[i];
    ret[i] = ret[jumble];
    ret[jumble] = cache;
  };

  return ret;

};
