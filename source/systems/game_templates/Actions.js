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

    this.visit_log = new Array();
    this.previous_visit_log = new Array();

    this.game = game;

    return this;

  }

  add (identifier, triggers, options, rearrange=true) {

    // Actions are calculated relative to the step

    var allowed = ["cycle", "chat", "lynch", "nightkilled",
    "attacked", "killed", "visit", "roleblock", "postcycle",
    "instant", "outvisit", "retrovisit", "retrocycle", "miscellaneous"];

    for (var i = 0; i < triggers.length; i++) {
      if (!allowed.includes(triggers[i])) {
        var err = "Unknown trigger " + triggers[i] + ".";
        throw new Error(err);
      };
    };

    var actionable = options;

    if (triggers.includes("retrovisit")) {

      if (triggers.length > 1) {
        var err = "Retrovisit trigger cannot be combined.";
        throw new Error(err);
      };

    };

    if (triggers.includes("retrocycle")) {

      if (triggers.length > 1) {
        var err = "Retrovisit trigger cannot be combined.";
        throw new Error(err);
      };

    };

    actionable.id = crypto.randomBytes(4).toString("hex");
    actionable.identifier = identifier;
    actionable.triggers = triggers;

    actionable.tags = actionable.tags || new Array();
    actionable.meta = actionable.meta || new Object();

    if (actionable.from !== "*") {
      var from = this.game.getPlayer(actionable.from);
      actionable.from = from.identifier;
    };

    if (actionable.to !== "*") {
      var to = this.game.getPlayer(actionable.to);
      actionable.to = to.identifier;
    };

    var implicit_priority = from.getStat("priority", Math.max);

    actionable.priority = actionable.priority || implicit_priority;

    // Number of "hits" before execution
    // Defaults to zero - immediately execute when hit
    actionable.execution = actionable.execution || 0;
    actionable.cycles = 0;

    actionable._scan = new Array();

    // Append new tags to array
    var runnable = actionables[actionable.identifier];

    if (typeof runnable === "function" && Array.isArray(runnable.TAGS)) {
      actionable.tags = actionable.tags.concat(runnable.TAGS);
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

    if (rearrange) {
      this.sortByPriority(true);
    };

    if (triggers.includes("instant")) {
      // Execute immediately
      this.execute("instant");
    };

    return actionable;

  }

  sortByPriority (shuffle_first=false) {

    if (shuffle_first) {
      this.actions = auxils.shuffle(this.actions);
    };

    this.actions.sort(function (a, b) {

      if (!a || !b) {
        return -1;
      };

      return a.priority - b.priority;
    });
  }

  findAllTagged (tag) {

    var ret = new Array();

    for (var i = 0; i < this.actions.length; i++) {

      if (!this.actions[i]) {
        continue;
      };

      if (this.actions[i].tags.includes(tag)) {
        ret.push(this.actions[i]);
      };
    };

    return ret;

  }

  find (key, value) {

    for (var i = 0; i < this.actions.length; i++) {

      if (!this.actions[i]) {
        continue;
      };

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

      if (!this.actions[i]) {
        continue;
      };

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

      if (!this.actions[i]) {
        continue;
      };

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

    if (type === "chat") {
      var sender = game.getPlayerById(params.message.author.id);

      if (!sender) {
        return null;
      };

      params.target = sender.identifier;

    };

    if (type === "visit") {
      this.visit_log.push(params);
      this.execute("outvisit", params);
    };

    var i = 0;
    while (i < this.actions.length) {

      var action = this.actions[i];

      if (!action) {
        i++;
        continue;
      };

      if (action._scan.includes(loop_id)) {
        i++;
        continue;
      };

      action._scan.push(loop_id);

      if (["cycle"].includes(type) && !action.triggers.includes("retrovisit") && !action.triggers.includes("retrocycle")) {

        action.execution--;
        action.cycles++;

        if (action.expiry !== Infinity && !action.tags.includes("permanent")) {
          action.expiry--;
        };

      };

      if (["retrocycle"].includes(type) && (action.triggers.includes("retrovisit") || action.triggers.includes("retrocycle"))) {

        action.execution--;
        action.cycles++;

        if (action.expiry !== Infinity && !action.tags.includes("permanent")) {
          action.expiry--;
        };
      };

      if (!action.triggers.includes(type)) {
        i++;
        continue;
      };

      var run = actionables[action.identifier];

      if (!run) {
        console.warn("Bad undefined function in actions: " + action.identifier + "!");
        i++;
        continue;
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

      var rerun = false;

      // Non-routine triggers
      if (["chat", "lynch", "nightkill", "attacked", "killed", "visit", "roleblock", "outvisit", "retrovisit", "miscellaneous"].includes(type)) {
        var target = action.target || action.to;

        var check = params.target;

        if (["outvisit"].includes(type)) {
          check = params.visitor;
        };

        if (check === target || target === "*") {

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
      if (["cycle", "postcycle", "instant", "retrocycle"].includes(type)) {

        if (action.execution <= 0) {
          var result = execute();

          if (result === true) {
            // Immediately mark for deletion
            action.expiry = 0;
          };

        };

      };

      /* Had to shift this in;
      yes, yes, I know it slows stuff down;
      but dang it there's no easier way out */
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

      if (!action) {
        continue;
      };

      action._scan = this.actions[i]._scan.filter(x => x !== loop_id);

    };

    if (type === "cycle") {

      for (var i = 0; i < this.visit_log.length; i++) {
        this.execute("retrovisit", this.visit_log[i]);
      };

      this.execute("retrocycle");

      this.previous_visit_log = this.previous_visit_log.concat(this.visit_log);
      this.visit_log = new Array();
    };

    // Decrement those outside cycle
    if (check_expiries) {

      this.nullExpiries();
      this.removeUndefinedActionables();

    };

  }

  reinstantiate (game) {
    this.game = game;
  }

  nullExpiries (trigger=null) {
    // Check expiries, remove
    for (var i = 0; i < this.actions.length; i++) {

      if (!this.actions[i]) {
        continue;
      };

      if (this.actions[i].expiry < 1 && (this.actions[i].triggers.includes(trigger) || trigger === null)) {
        // Remove
        this.previous.push(this.actions[i]);
        delete this.actions[i];
      };
    };

  }

  removeUndefinedActionables () {
    for (var i = this.actions.length - 1; i >= 0; i--) {
      if (!this.actions[i]) {
        this.actions.splice(i, 1);
      };
    };
  }

};
