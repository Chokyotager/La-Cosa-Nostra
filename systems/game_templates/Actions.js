// Stores all the executable actions

var actionables = require("../actionables.js"); // for now
var crypto = require("crypto");
var Player = require("./Player.js");

var auxils = require("../auxils.js");

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

    actionable.tags = actionable.tags || new Array();

    var from = this.game.getPlayer(actionable.from);
    var to = this.game.getPlayer(actionable.to);

    actionable.from = from.identifier;
    actionable.to = to.identifier;

    var implicit_priority = from.getStat("priority", Math.max);

    actionable.priority = actionable.priority || implicit_priority;

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
      this.actions = auxils.shuffle(this.actions);
    };

    this.actions.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }

  findAllTagged (tag) {

    var ret = new Array();

    for (var i = 0; i < this.actions.length; i++) {
      if (this.actions[i].tags.includes(tag)) {
        ret.push(this.actions[i]);
      };
    };

    return ret;

  }

  find (key, value) {

    for (var i = 0; i < this.actions.length; i++) {

      if (typeof key === "function") {
        var condition = key(this.actions[i]);

        if (condition) {
          return this.actions[i];
        };

      } else {

        if (this.actions[i][key] === value) {
          return this.actions[i];
        };

      };

    };

    return undefined;

  }

  findAll (key, value) {

    var ret = new Array();

    for (var i = 0; i < this.actions.length; i++) {

      if (typeof key === "function") {
        var condition = key(this.actions[i]);

        if (condition) {

          ret.push(condition);

        };

      } else if (this.actions[i][key] === value) {

          ret.push(this.actions[i]);

        };

    };

    return ret;

  }

  delete (key, value) {

    var ret = new Array();

    for (var i = this.actions.length - 1; i >= 0; i--) {

      if (typeof key === "function") {

        var condition = key(this.actions[i]);

        if (condition) {
          ret.push(this.actions[i]);
          this.actions.splice(i, 1);
        };

      } else {

        if (this.actions[i][key] === value) {
          ret.push(this.actions[i]);
          this.actions.splice(i, 1);
        };

      };

    };

    return ret;

  }

  exists (key, value) {

    return this.find(key, value) !== undefined;

  }

  get () {
    return this.actions;
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

    var game = this.game;

    for (var i = 0; i < this.actions.length; i++) {

      var action = this.actions[i];

      if (action.triggers.includes(type)) {
        // Execute action
        var run = actionables[action.identifier];

        if (run === undefined) {
          console.warn("Bad undefined function in actions!");
          continue;
        };

        // Non-routine triggers
        if (["chat", "lynch", "nightkill", "attacked", "killed"].includes(type)) {
          var target = action.target || action.to;

          if (params.target === target) {
            var result = execute();

            if (!result) {
              action.expiry--;
            };

          };

        };

        // Periodic-triggers
        if (["cycle"].includes(type)) {

          var result = execute();

        };

        function execute () {

          try {
            var result = run(action, game, params);
            return false;
          } catch (err) {
            console.log(err);
            return false;
          };

        };

      };

      if (type === "cycle") {
        action.expiry--;
      };

    };

    if (check_expiries) {
      this.expiration(type);
    };

  }

  reinstantiate (game) {
    this.game = game;
  }

  // IMPORTANT: trigger WIP
  expiration (trigger=null) {
    // Check expiries, remove
    for (var i = this.actions.length - 1; i >= 0; i--) {
      if (this.actions[i].expiry < 1 && (this.actions[i].triggers.includes(trigger) || trigger === null)) {
        // Remove
        this.previous.push(this.actions[i]);
        this.actions.splice(i, 1);
      };
    };
  }

};
