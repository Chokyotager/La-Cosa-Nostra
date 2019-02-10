var actionables = require("../actionables.js");
var attributes = require("../attributes.js");

var executable = require("../executable.js");
var auxils = require("../auxils.js");
var crypto = require("crypto");

module.exports = class {

  constructor () {

  }

  isVotedAgainstBy (identifier) {

    // Check if id is voting against player

    for (var i = 0; i < this.votes.length; i++) {
      if (this.votes[i].identifier === identifier) {
        return true;
      };
    };

    return false;

  }

  voteAgainst (identifier, magnitude=1) {
    // x votes against this player
    this.votes.push({identifier: identifier, magnitude: magnitude});
  }

  toggleVotes (identifier, magnitude=1) {
    if (this.isVotedAgainstBy(identifier)) {
      this.clearVotesBy(identifier);
      return false;
    } else {
      this.voteAgainst(identifier, magnitude)
      return true;
    };
  }

  clearVotesBy (identifier) {
    for (var i = 0; i < this.votes.length; i++) {
      if (this.votes[i].identifier === identifier) {
        this.votes.splice(i, 1);
        return true;
      };
    };
    return false;
  }

  clearVotes () {
    this.votes = new Array();
  }

  countVotes () {
    // Offset the vote count

    var votes = new Number();

    for (var i = 0; i < this.votes.length; i++) {
      // Magnitude
      votes += this.votes[i].magnitude;
    };

    // Offset is calculated elsewhere
    return votes;

  }

  getVoteOffset () {
    return this.getStat("vote-offset", (a, b) => a + b);
  }

  init (id, alphabet, role) {

    this.id = id;
    this.alphabet = alphabet;
    this.role_identifier = role;
    this.base_flavour_identifier = undefined;

    this.initial_role_identifier = [role];

    this.identifier = crypto.randomBytes(8).toString("hex") + "-" + this.id;

    this.channel = null;

    this.special_channels = new Array();

    this.pre_emptive = new Array();
    this.votes = new Array();

    this.intro_messages = new Array();

    // 3x stats - game_stats, permanent_stats, role.stats

    this.status = {
      "alive": true,

      "roleblocked": false,
      "controlled": false,
      "silenced": false,
      "kidnapped": false,

      "won": false
    };

    this.misc = new Object();

    this.visiting = new Array();

    this.will = undefined;

    this.display_role = undefined;
    this.display_secondary = undefined;

    this.instantiateRole();

    this.see_mafia_chat = this.role["see-mafia-chat"];

    this.permanent_stats = {
      "basic-defense": 0,
      "roleblock-immunity": 0,
      "detection-immunity": 0,
      "control-immunity": 0,
      "redirection-immunity": 0,
      "kidnap-immunity": 0,
      "priority": 0,
      "vote-offset": 0,
      "vote-magnitude": this.role.stats["vote-magnitude"]
    };

    // Initialise stats
    // A more than value will cause
    // the action to fire
    this.game_stats = {
      "basic-defense": 0,
      "roleblock-immunity": 0,
      "detection-immunity": 0,
      "control-immunity": 0,
      "redirection-immunity": 0,
      "kidnap-immunity": 0,
      "priority": 0,
      "vote-offset": 0,
      "vote-magnitude": this.permanent_stats["vote-magnitude"]
    };

    // Attributes
    this.attributes = new Array();

    return this;

  }

  postGameInit () {
    this.instantiateFlavour();
  }

  addPreemptiveVote (identifier) {
    this.pre_emptive.push(identifier);
  }

  clearPreemptiveVotes (runnable) {

    if (typeof runnable === "function") {

      for (var i = this.pre_emptive.length - 1; i >= 0; i--) {

        var identifier = this.pre_emptive[i];

        var player = this.game.getPlayerByIdentifier(identifier);

        var outcome = runnable(player);

        if (outcome === true) {
          this.pre_emptive.splice(i, 1);
        };

      };

    } else {

      this.pre_emptive = new Array();

    };

  }

  getPreemtiveVotes () {
    return this.pre_emptive;
  }

  resetTemporaryStats () {

    this.game_stats = {
      "basic-defense": 0,
      "roleblock-immunity": 0,
      "detection-immunity": 0,
      "control-immunity": 0,
      "redirection-immunity": 0,
      "kidnap-immunity": 0,
      "priority": 0,
      "vote-offset": 0,
      "vote-magnitude": this.permanent_stats["vote-magnitude"]
    };

    this.setStatus("roleblocked", false);
    this.setStatus("controlled", false);
    this.setStatus("silenced", false);
    this.setStatus("kidnapped", false);

  }

  setGameStat (key, amount, modifier) {

    if (modifier === "set") {
      modifier = () => amount;
    };

    if (modifier === undefined) {
      modifier = auxils.operations.addition;
    };

    var final = modifier(this.game_stats[key], amount);

    this.game_stats[key] = final;

    return final;

  }

  setPermanentStat (key, amount, modifier) {

    if (modifier === "set") {

      var final = amount;

    } else {

      if (modifier === undefined) {
        modifier = (a, b) => a + b;
      };

      var final = modifier(this.permanent_stats[key], amount);

    };

    this.permanent_stats[key] = final;

    return final;

  }

  getPrivateChannel () {
    var guild = this.game.client.guilds.get(this.game.config["server-id"]);

    var channel = guild.channels.get(this.channel.id);

    return channel;
  }

  getRoleStats () {
    return this.role.stats;
  }

  getPermanentStats () {
    return this.permanent_stats;
  }

  getTemporaryStats () {
    return this.game_stats;
  }

  getVoteMagnitude () {
    return this.getTemporaryStats()["vote-magnitude"];
  }

  getStat (key, modifier) {

    if (modifier === undefined) {
      modifier = (a, b) => a + b;
    };

    if (key === "vote-magnitude") {
      var err = "[Vote magnitude] get this number with Player.getVoteMagnitude()";
      throw new Error(err);
    };

    var a = this.game_stats[key];
    var b = this.permanent_stats[key];
    var c = this.role.stats[key];

    return modifier(modifier(a, b), c);

  }

  getStatus (key) {
    return this.status[key];
  }

  setStatus (key, value) {
    this.status[key] = value;
  }

  setWill (will) {
    this.will = will;
  }

  setPrecedentWill (will) {
    this.precedent_will = will;
  }

  getWill () {

    var will = this.precedent_will;

    if (will === null) {
      return undefined;
    };

    return this.precedent_will || this.will;
  }

  getTrueWill () {
    // Gets the vanilla will
    return this.will;
  }

  getGuildMember () {

    var client = this.game.client;
    var config = this.game.config;

    var guild = client.guilds.get(config["server-id"]);

    var member = guild.members.get(this.id);

    return member;

  }

  getDisplayName () {
    var member = this.getGuildMember();

    if (member === undefined) {
      return "[" + this.alphabet + "] undef'd player";
    } else {
      return member.displayName;
    };

  }

  lynchable () {
    // Set the player to be lynched

    // Future special functions may go here

    return true;
  }

  kill () {
    this.status.alive = false;
  }

  async start () {

    if (this.role.start !== undefined) {

      try {
        this.role.start(this);
      } catch (err) {
        console.log(err);
      };

    };

    // Start attributes
    for (var i = 0; i < this.attributes.length; i++) {

      var attribute = attributes[this.attributes[i].identifier];

      if (attribute.start) {

        try {
          attribute.start(this);
        } catch (err) {
          console.log(err);
        };

      };

    };

    await this.postIntro();
    this.__routines();

  }

  async postIntro () {
    // Post intro
    await executable.roles.postRoleIntroduction(this);
  }

  getDisplayRole (append_true_role=true) {
    // Show display role first

    return this.display_role || this.getTrueFlavourRole(append_true_role);
  }

  getTrueFlavourRole (append_true_role=true) {
    // Show display role first

    var flavour_role = this.flavour_role;

    var flavour = this.game.getGameFlavour();

    if (flavour && flavour_role) {
      var display_extra = flavour.info["display-role-equivalent-on-death"];

      if (display_extra && flavour_role !== this.role["role-name"] && append_true_role) {
        flavour_role += " (" + (this.display_secondary || this.role["role-name"]) + ")";
      };
    };

    return flavour_role || this.role["role-name"];
  }

  setDisplayRole (role_name) {
    this.display_role = role_name;
  }

  clearDisplayRole () {
    this.display_role = null;
  }

  getRole () {
    // Give true role
    return this.display_secondary || this.role["role-name"];
  }

  getInitialRole (append_true_role=true) {
    var flavour_role = this.flavour_role;

    var flavour = this.game.getGameFlavour();

    var initial = executable.roles.getRole(this.initial_role_identifier[0])["role-name"];

    if (flavour && flavour_role) {

      if (flavour_role !== initial && append_true_role) {
        flavour_role += " (" + (this.display_secondary || initial) + ")";
      };
    };

    return flavour_role || initial || this.role["role-name"];
  }

  getInitialRoleDetails () {
    return executable.roles.getRole(this.initial_role_identifier[0]);
  }

  assignChannel (channel) {
    this.channel = {
      id: channel.id,
      name: channel.name,
      created_at: channel.createdAt
    };

    this.addSpecialChannel(channel);

  }

  addSpecialChannel (channel) {
    this.special_channels.push({
      id: channel.id,
      name: channel.name,
      created_at: channel.createdAt
    });
  }

  getSpecialChannels () {
    return this.special_channels;
  }

  reinstantiate (game) {
    this.setGame(game);
    this.instantiateRole();
  }

  verifyProperties () {

    var incompatible = new Array();

    var role = executable.roles.getRole(this.role_identifier, true);

    if (!role) {
      incompatible.push({type: "role", identifier: this.role_identifier});
    };

    for (var i = 0; i < this.attributes.length; i++) {
      var identifier = this.attributes[i].identifier;

      if (!attributes[identifier]) {
        incompatible.push({type: "attribute", identifier: identifier});
      };
    };

    return incompatible;

  }

  setGame (game) {
    this.game = game;
  }

  isAlive () {
    return this.getStatus("alive");
  }

  changeRole (role_identifier, change_vote_magnitude_stat=false, rerun_start=true) {
    this.role_identifier = role_identifier;
    this.initial_role_identifier.push(role_identifier);

    this.instantiateRole();

    this.see_mafia_chat = this.see_mafia_chat || this.role["see-mafia-chat"];

    if (change_vote_magnitude_stat) {
      var current_magnitude = this.getRoleStats()["vote-magnitude"];
      this.setPermanentStat("vote-magnitude", current_magnitude, "set");
    };

    if (rerun_start && this.role.start !== undefined) {
      this.role.start(this);
    };

  }

  instantiateRole () {

    this.role = executable.roles.getRole(this.role_identifier);

  }

  instantiateFlavour () {

    var flavour = this.game.getGameFlavour();

    if (!flavour) {
      return null;
    };

    // Base flavour identifier to override
    var identifier = this.base_flavour_identifier || this.role_identifier;

    // Open identifier
    var current = flavour.roles[identifier];

    if (!current) {
      // Flavour role not defined
      this.flavour_role = null;
      return null;
    };

    var assigned = this.game.findAll(x => x.role_identifier === identifier && !x.flavour_role);

    var index = assigned.length % current.length;

    // Roles is an array
    // Count number of roles assigned before
    this.flavour_role = current[index].name;

    console.log("Flavour: %s, Role: %s", this.flavour_role, this.role_identifier);

  }

  isSame (player) {
    // Compare identifiers
    return this.identifier === player.identifier;
  };

  __routines () {

    this.resetTemporaryStats();

    this.checkAttributeExpiries();

    var ret = this.executeRoutine(this.role.routine);

    for (var i = 0; i < this.attributes.length; i++) {
      var runnable = attributes[this.attributes[i].identifier].routines;

      try {
        this.executeRoutine(runnable);
      } catch (err) {
        console.log(err);
      };

    };

    return ret;

  }

  executeRoutine (routine) {
    if (routine === undefined) {
      return null;
    };

    // Check if dead
    if (!this.isAlive() && !routine.ALLOW_DEAD) {
      return null;
    };

    if (this.game.isDay() && !routine.ALLOW_DAY) {
      return null;
    };

    if (!this.game.isDay() && !routine.ALLOW_NIGHT) {
      return null;
    };

    try {

      return routine(this);

    } catch (err) {

      console.log(err);
      return null;

    }

  }

  setWin () {
    this.status.won = true;
  }

  hasWon () {
    return this.status.won === true;
  }

  addIntroMessage (message) {
    this.intro_messages.push(message);
  }

  substitute (id) {
    this.id = id;
  }

  hasAttribute (attribute) {

    // Attribute format:
    // {identifier: "attribute_name", expiry: 1}

    return this.attributes.some(x => x.identifier === attribute);

  }

  addAttribute (attribute, expiry=Infinity, tags=new Object()) {

    if (!attributes[attribute]) {
      throw new Error("Invalid attribute identifier " + attribute + "!");
    };

    var addable = {identifier: attribute, expiry: expiry, tags: tags, attribute: attributes[attribute].attribute};

    if (attributes[attribute].start && this.game) {

      try {
        attributes[attribute].start(this, addable);
      } catch (err) {
        console.log(err);
      };

    };

    this.attributes.push(addable);

  }

  checkAttributeExpiries () {

    for (var i = this.attributes.length - 1; i >= 0; i--) {

      if (this.attributes[i].expiry !== Infinity) {
        this.attributes[i].expiry--;
      };

      if (this.attributes[i].expiry <= 0) {
        this.attributes.splice(i, 1);
      };

    };

  }

  deleteAttributes (key, value) {

    var ret = new Array();

    for (var i = this.attributes.length - 1; i >= 0; i--) {

      if (!this.attributes[i]) {
        continue;
      };

      if (typeof key === "function") {

        var condition = key(this.attributes[i]);

        if (condition) {
          ret.push(this.attributes[i]);
          this.attributes.splice(i, 1);
        };

      } else {

        if (this.attributes[i][key] === value) {
          ret.push(this.attributes[i]);
          this.attributes.splice(i, 1);
        };

      };

    };

    return ret;

  }

  deleteAttribute (key, value) {

    for (var i = this.attributes.length - 1; i >= 0; i--) {

      if (!this.attributes[i]) {
        continue;
      };

      if (typeof key === "function") {

        var condition = key(this.attributes[i]);

        if (condition) {
          var ret = this.attributes[i];
          this.attributes.splice(i, 1);

          return ret;
        };

      } else {

        if (this.attributes[i][key] === value) {
          var ret = this.attributes[i];
          this.attributes.splice(i, 1);

          return ret;
        };

      };

    };

    return null;

  }

  getDiscordUser (alphabet) {
    return this.game.client.users.get(this.id);
  }

  setBaseFlavourIdentifier (identifier) {
    this.base_flavour_identifier = identifier;
  }

  setDisplaySecondary (identifier) {
    this.display_secondary = identifier;
  }

};

function dateTimeReviver (key, value) {

  var date_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/g;

  if (typeof value === "string" && date_format.test(value)) {

    return new Date(value);
  };

  return value;

};
