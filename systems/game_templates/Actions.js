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

  add (identifier, triggers, options, rearrange=true) {

    // Actions are calculated relative to the step

    var allowed = ["cycle", "chat", "lynch", "nightkilled", "attacked", "killed", "visit"];

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

    // Number of "hits" before execution
    // Defaults to zero - immediately execute when hit
    actionable.execution = actionable.execution || 0;
    actionable.cycles = 0;

    actionable._scan = new Array();

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

    if (rearrange) {
      this.sortByPriority(true);
    };

    return actionable;

  }

  sortByPriority (shuffle_first=false) {

    if (shuffle_first) {
      this.actions = auxils.shuffle(this.actions);
    };

    this.actions.sort(function (a, b) {

      if (a === undefined || b === undefined) {
        return -1;
      };

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

          ret.push(this.actions[i]);

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

    // Create loop identifier
    var loop_id = crypto.randomBytes(8).toString("hex");

    var game = this.game;

    var i = 0;
    while (i < this.actions.length) {

      var action = this.actions[i];

      if (action === undefined) {
        i++;
        continue;
      };

      if (action._scan.includes(loop_id) || !action.triggers.includes(type)) {
        i++;
        continue;
      };

      action._scan.push(loop_id);
      var run = actionables[action.identifier];

      if (run === undefined) {
        console.warn("Bad undefined function in actions!");
        i++;
        continue;
      };

      var rerun = false;

      // Non-routine triggers
      if (["chat", "lynch", "nightkill", "attacked", "killed", "visit"].includes(type)) {
        var target = action.target || action.to;

        if (params.target === target) {

          action.execution--;

          if (action.execution <= 0) {
            var result = execute();

            if (result === true) {
              // Immediately mark for deletion
              action.expiry = 0;
            };
          };

        };

      };

      // Periodic-triggers
      if (["cycle"].includes(type)) {

        action.execution--;

        if (action.execution <= 0) {
          var result = execute();
        };

      };

      function execute () {

        rerun = true;

        try {
          var result = run(action, game, params);
          return result;
        } catch (err) {
          console.log(err);
          return false;
        };

      };

      /* Had to shift this in;
      yes, yes, I know it slows stuff down;
      but dang it there's no easier way out */

      if (["cycle"].includes(type)) {

        if (action.expirty === Infinity || action.tags.includes["permanent"]) {
          action.expiry--;
        };

        action.cycles++;

      };

      if (check_expiries) {
        this.nullExpiries(type);
      };

      if (rerun) {
        i = 0;
      } else {
        i++;
      };

    };

    // Remove loop ID
    for (var i = 0; i < this.actions.length; i++) {

      var action = this.actions[i];

      action._scan = this.actions[i]._scan.filter(x => x !== loop_id);

      // Decrement those outside cycle
      if (!["cycle"].includes(type)) {
        action.expiry--;
        action.cycles++;

        if (check_expiries) {
          this.nullExpiries();
        };

      };

    };

  }

  reinstantiate (game) {
    this.game = game;
  }

  nullExpiries (trigger=null) {
    // Check expiries, remove
    for (var i = this.actions.length - 1; i >= 0; i--) {

      if (this.actions[i] === undefined) {
        continue;
      };

      if (this.actions[i].expiry < 1 && (this.actions[i].triggers.includes(trigger) || trigger === null)) {
        // Remove
        this.previous.push(this.actions[i]);
        this.actions.splice(i, 1);
      };
    };
  }

};
