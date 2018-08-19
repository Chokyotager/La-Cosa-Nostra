var executable = require("../executable.js");
var crypto = require("crypto");

module.exports = class {

  constructor () {

  }

  isVotedAgainstBy (id) {

    // Check if id is voting against player

    for (var i = 0; i < this.votes.length; i++) {
      if (this.votes[i] === id) {
        return true;
      };
    };
    return false;
  }

  voteAgainst (id) {
    this.votes.push(id);
  }

  toggleVotes (id) {
    if (this.isVotedAgainstBy(id)) {
      this.clearVotesBy(id);
      return false;
    } else {
      this.votes.push(id);
      return true;
    };
  }

  clearVotesBy (id) {
    for (var i = 0; i < this.votes.length; i++) {
      if (this.votes[i] === id) {
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

    var votes = this.votes.length;

    return votes;

  }

  getVoteOffset () {
    return this.game_stats["vote-offset"] + this.role.stats["vote-offset"];
  }

  init (id, alphabet, role) {

    this.id = id;
    this.alphabet = alphabet;
    this.role_identifier = role;

    this.identifier = crypto.randomBytes(8).toString("hex");

    this.channel = null;

    this.special_channels = new Array();

    this.votes = new Array();

    // Initialise stats
    // A more than value will cause
    // the action to fire
    this.game_stats = {
      "basic-defense": 0,
      "roleblock-immunity": 0,
      "detection-immunity": 0,
      "control-immunity": 0,
      "priority": 0,
      "vote-offset": 0
    };

    this.permanent_stats = {
      "basic-defense": 0,
      "roleblock-immunity": 0,
      "detection-immunity": 0,
      "control-immunity": 0,
      "priority": 0,
      "vote-offset": 0
    };

    // 3x stats - game_stats, permanent_stats, role.stats

    this.status = {
      "alive": true,
      "roleblocked": false,
      "controlled": false,
      "silenced": false
    };

    this.misc = new Object();

    this.visiting = new Array();

    this.will = undefined;

    this.display_role = undefined;

    this.instantiateRole();

    return this;

  }

  setGameStat (key, amount, modifier) {

    if (modifier === undefined) {
      modifier = (a, b) => a + b;
    };

    var final = modifier(this.game_stats[key], amount);

    this.game_stats[key] = final;

    return final;

  }

  setPermanentStat (key, amount, modifier) {

    if (modifier === undefined) {
      modifier = (a, b) => a + b;
    };

    var final = modifier(this.permanent_stats[key], amount);

    this.permanent_stats[key] = final;

    return final;

  }

  setWill (will) {
    this.will = will;
  }

  getTrueWill () {
    // Gets the vanilla will
    return this.will;
  }

  lynch () {
    // Set the player to be lynched

    // Future special functions may go here

    this.status.alive = false;

    return true;
  }

  start () {

    if (this.role.start !== undefined) {
      this.role.start(this);
    };

    this.postIntro();

  }

  postIntro () {
    // Post intro
    executable.roles.postRoleIntroduction(this);
  }

  getDisplayRole () {
    // Show display role first
    return this.display_role !== undefined ? this.display_role : this.role["role-name"];
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

  setGame (game) {
    this.game = game;
  }

  instantiateRole () {

    this.role = executable.roles.getRole(this.role_identifier);

  }

  isSame (player) {
    // Compare identifiers
    return this.identifier === player.identifier;
  };

  __routines (game) {

    if (this.role.routine === undefined) {
      return null;
    };

    return this.role.routine(this);

  }

};

function dateTimeReviver (key, value) {

  var date_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/g;

  if (typeof value === "string" && date_format.test(value)) {

    return new Date(value);
  };

  return value;

};
