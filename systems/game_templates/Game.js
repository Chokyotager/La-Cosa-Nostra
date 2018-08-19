/*
By the time this instance
is initialised, the roles should
already be defined
*/

var executable = require("../executable.js");
var alphabets = require("../alpha_table.js");

var Actions = require("./Actions.js");

module.exports = class {

  constructor (client, config) {

    this.client = client;
    this.config = config;
    this.temp = new Object();

  }

  init (players) {

    this.players = players;
    this.init_time = new Date();

    this.actions = new Actions().init(this);

    this.players_tracked = players.length;

    this.channels = new Object();

    this.period_log = new Object();

    this.period = this.config["game"]["day-zero"] ? 0 : 1;
    this.state = "pre-game";

    // Timezone is GMT relative
    this.timezone = this.config.time.timezone;

    // Always start day zero at closest 12pm/am
    var current = new Date();
    var hours = Math.abs((current.getUTCHours() + this.timezone) % 24);

    if (hours >= 12) {
      // Next one at 00:00
      hours = 24 - this.timezone;
    } else {
      hours = 12 - this.timezone;
    };

    current.setUTCHours(hours, 0, 0, 0);

    this.start_time = current;
    this.current_time = current;

    this.next_action = new Date(current);

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].setGame(this);
    };

    return this;

  }

  setChannel (name, channel) {

    // This.channels stores SPECIAL channels,
    // not the private ones
    // not the logging ones either

    this.channels[name] = {id: channel.id, name: channel.name, created_at: channel.createdAt};

  };

  getPlayerById (id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        return this.players[i];
      };
    };
    return null;
  }

  getPlayerByAlphabet (alphabet) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].alphabet === alphabet.toUpperCase()) {
        return this.players[i];
      };
    };
    return null;
  }

  getAlive () {
    // Count number alive
    var count = new Number();
    for (var i = 0; i < this.players.length; i++) {
      count += this.players[i].status.alive ? 1 : 0;
    };

    return count;
  }

  getAlivePlayers () {

    var alive = new Array();

    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].status.alive) {
        alive.push(this.players[i]);
      };
    };

    return alive;

  }

  async createTrialVote () {

    var messages = await executable.misc.createTrialVote(this);

    var period_log = this.getPeriodLog();

    period_log.trial_vote = {messages: new Array(), channel: messages[0].channel.id};

    for (var i = 0; i < messages.length; i++) {
      period_log.trial_vote.messages.push(messages[i].id);
    };

    this.instantiateTrialVoteCollector();

  }

  async instantiateTrialVoteCollector () {

    var period_log = this.getPeriodLog();

    if (period_log === undefined || period_log.trial_vote === null) {
      return null;
    };

    var channel = this.client.channels.get(period_log.trial_vote.channel);

    this.temp.trial_collectors = new Array();

    for (var i = 0; i < period_log.trial_vote.messages.length; i++) {
      var message = await channel.fetchMessage(period_log.trial_vote.messages[i]);

      // Casting instance to bigger scope
      var run_as = this;

      this.temp.trial_collectors.push(message.createReactionCollector(function (reaction, user) {
        run_as.__receivedTrialVote(reaction, user);
      }));
    };

  }

  clearTrialVoteReactions (remove_extra=true) {

    var period_log = this.getPeriodLog();

    if (period_log.trial_vote === null) {
      return null;
    };

    var channel_id = period_log.trial_vote.channel;
    var messages_id = period_log.trial_vote.messages;

    for (var i = 0; i < messages_id.length; i++) {
      executable.misc.clearReactions(this, channel_id, messages_id[i]);

      if (i > 0 && remove_extra) {
        executable.misc.deleteMessage(this, channel_id, messages_od[i])
      };

    };

    // Remove promises to free up memory
    for (var i = 0; i < this.temp.trial_collectors; i++) {
      this.temp.trial_collectors[i].resolve("Autocleared");
    };

  }

  async __receivedTrialVote (reaction, user) {

    if (user.bot) {
      return null;
    };

    reaction.remove(user);

    if (!this.isAlive(user.id)) {
      user.send("You are not alive and in the game, please do not vote in the trials! If you try that again, I will have you kicked.");
      return null;
    };

    var reversed = flipObject(alphabets);
    var emote = reaction.emoji;

    var alphabet = reversed[emote];

    if (alphabet === undefined) {
      return null;
    };

    // Count the vote
    var voter = this.getPlayerById(user.id);
    var voted_against = this.getPlayerByAlphabet(alphabet);

    // Post corresponding messages
    if (voted_against !== null) {

      // Bug check
      if (!voted_against.status.alive) {
        console.log("Dead player voted on!");
        user.send("You voted on a dead player! Sorry man, but the dude is already dead!");
      };

      var already_voting = voted_against.isVotedAgainstBy(voter.id);

      if (!already_voting && this.votesOn(voter.id).length >= this.getLynchesAvailable()) {
        // New vote, check if exceeds limit
        return null;
      };

      var before_votes = voted_against.countVotes();

      var toggle_on = voted_against.toggleVotes(voter.id);

      var after_votes = voted_against.countVotes();

      if (toggle_on) {
        // New vote
        executable.misc.addedLynch(this, voter.id, voted_against.id);
      } else {
        executable.misc.removedLynch(this, voter.id, voted_against.id);
      };

      this.__reloadTrialVoteMessage();
      this.__checkLynchAnnouncement(voted_against.id, before_votes, after_votes);
    };

    // Save file
    this.save();

  }

  votesOn (id) {
    // Get everyone someone is voting against

    var roles = new Array();

    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].isVotedAgainstBy(id)) {
        roles.push(this.players[i]);
      };
    };

    return roles;

  }

  __checkLynchAnnouncement (id, before, after) {

    var role = this.getPlayerById(id);
    var required = this.getVotesRequired() - role.getVoteOffset();

    if (before < required && after >= required) {
      // New lynch
      executable.misc.lynchReached(this, role);
    } else if (before >= required && after < required) {
      executable.misc.lynchOff(this, role);
    };

  }

  __reloadTrialVoteMessage () {
    executable.misc.editTrialVote(this);
  }

  clearAllVotesBy (id) {
    // Clears all the votes on other people
    // by id specified

    var cleared = false;

    for (var i = 0; i < this.players.length; i++) {
      cleared = cleared || this.players[i].clearVotesBy(id);
    };

    return cleared;

  }

  clearVotes (edit_trial=false) {
    // Clear ALL votes
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].clearVotes();
    };

    if (edit_trial) {
      this.__reloadTrialVoteMessage();
    };

  }

  isAlive (id) {
    var alive = this.getAlivePlayers();

    for (var i = 0; i < alive.length; i++) {
      if (alive[i].id === id) {
        return true;
      };
    };

    return false;

  }

  async step () {
    // Synced with Timer class
    // Should return next date

    // this.config.time.day

    this.current_time = new Date(this.next_action);
    this.next_action = calculateNextAction(this.next_action, this.period, this.config);

    if (this.state === "pre-game") {

      this.__routines();
      this.__start();

      this.cycle();

    } else if (this.state === "playing") {

      await this.precycle();

      this.period += 1;

      this.__routines();
      this.cycle();

      // Offset the broadcast by -1 since period
      // has already been added
      executable.misc.postNewPeriod(this, this.getBroadcast(-1));

    } else {

      return null;

    };

    // Save
    this.save();

    return this.next_action;

    function calculateNextAction (time, period, config) {
      var divided = period % 2;

      // Clone time obj
      time = new Date(time);

      if (divided === 0) {
        // Daytime
        time.setUTCHours(time.getUTCHours() + config["time"]["day"]);
      } else {
        time.setUTCHours(time.getUTCHours() + config["time"]["night"]);
      };

      return time;

    };

  }

  async precycle () {

    this.clearPeriodPins();

    if (this.period % 2 === 0) {

      await executable.misc.editTrialVote(this, true);
      this.clearTrialVoteReactions();

      // Dusk
      this.checkLynches();
      this.clearVotes();

      // Post all messages
      this.sendMessages();


    } else {

      // Dawn
      this.sendMessages();


    };
  }

  cycle () {
    if (this.period % 2 === 0) {

      this.day();

    } else {

      this.night();

    };
  }

  day () {
    // Executed at the start of daytime
    this.createTrialVote();

    if (this.config["game"]["mafia"]["night-only"]) {
      executable.misc.lockMafiaChat(this);
    } else {
      executable.misc.openMafiaChat(this);
    };

  }

  night () {
    // Executed at the start of nighttime

    // Lynch players
    executable.misc.openMafiaChat(this);


  }

  createPeriodPin (message) {

    var log = this.getPeriodLog();

    var result = executable.misc.pinMessage(message);

    if (result) {

      var jx = {
        "message": message.id,
        "channel": message.channel.id,
        "pin_time": new Date()
      };

      log.pins.push(jx);

    };

    return result;

  }

  checkLynches () {

    // Find players who will be lynched

    var lynched = new Array();

    for (var i = 0; i < this.players.length; i++) {
      var votes = this.players[i].countVotes();
      var required = this.getVotesRequired() - this.players[i].getVoteOffset();

      if (votes >= required) {
        // Execute the player
        var success = this.lynch(this.players[i]);

        if (success) {
          lynched.push(this.players[i]);
        };
      };

    };

    // Successful lynches go into lynched
    // Broadcast the lynches in the main channel

    executable.misc.broadcastMainLynch(this, lynched);

  }

  lynch (role) {

    var success = executable.misc.lynch(this, role.id);

    // Add lynch summary
    if (success) {
      this.addDeathBroadcast(role, "was __lynched__");
      this.addDeathMessage(role, "were __lynched__");
    };

    return success;

  }

  addDeathBroadcast (role, reason) {

    // Set reason
    var broadcast = executable.misc.getDeathBroadcast(this, role, reason);

    this.addBroadcastSummary(broadcast);

  }

  addBroadcastSummary (message) {
    var log = this.getPeriodLog();

    log.summary.push({message: message, time: new Date()});
  }

  addDeathMessage (role, reason) {
    var message = executable.misc.getDeathMessage(this, role, reason);

    this.addMessage(role, message);
  }

  addMessage (role, message) {
    var log = this.getPeriodLog();

    log.messages.push({message: message, recipient: role.id, time: new Date()});
  }

  getBroadcast (offset=0) {

    // Get the summary broadcast

    var log = this.getPeriodLog(offset);

    var broadcasts = log.summary;

    if (broadcasts.length < 1) {
      return undefined;
    } else {
      var concat = new Array();

      for (var i = 0; i < broadcasts.length; i++) {
        concat.push(broadcasts[i].message);
      };

      return concat.join("\n\n");
    };

  }

  sendMessages (offset=0) {

    // Actually sends messages

    var log = this.getPeriodLog(offset);

    var messages = log.messages;

    for (var i = 0; i < messages.length; i++) {
      var message = messages[i].message;

      executable.misc.sendIndivMessage(this, messages[i].recipient, message);

    };

  }

  clearPeriodPins (offset=0) {
    // Clears the pinned messages in the period log

    var log = this.getPeriodLog();
    var pins = log.pins;

    for (var i = 0; i < pins.length; i++) {
      var pin = pins[i];
      executable.misc.unpinMessage(this, pin.channel, pin.message);
    };

  }

  getGuildMember (id) {

    var guild = this.client.guilds.get(this.config["server-id"]);
    var member = guild.members.get(id);

    return member;

  }

  __win (faction) {
    executable.misc.postWin(this, faction);
  }

  __start () {

    this.state = "playing";

    executable.misc.postGameStart(this);
    executable.misc.openMainChats(this);

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].start();
    };

  }

  __routines () {
    // Check day night cycles, also used on referesh
    // Should not put post functions in here,
    // only administrative junk

    this.period_log[this.period.toString()] = {
      "trials": Math.ceil(this.config["game"]["lynch-ratio-floored"] * this.getAlive()),
      "summary": new Array(),
      "messages": new Array(),
      "trial_vote": null,
      "period": this.period,
      "pins": new Array()
    };

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].__routines();
    };

  }

  getLynchesAvailable (offset=0) {
    var log = this.getPeriodLog(offset);
    return log.trials;
  }

  getPeriodLog (offset=0) {
    return this.period_log[(this.period + offset).toString()];
  }

  getVotesRequired () {

    var alive = this.getAlive();

    // Ceiled of alive
    return 1;
    return Math.max(2, Math.ceil(alive / 2));

  }

  getDiscordUser (alphabet) {
    var id = this.getPlayerByAlphabet(alphabet);

    return this.client.users.get(id);
  }

  modkill (alphabet) {
    // TODO: modkill systems, + announcement
  }

  getFormattedDay (offset=0) {

    var period = this.period + offset;

    var numeral = Math.ceil(0.5 * period);

    if (period % 2 === 0) {
      return "Day " + numeral;
    } else {
      return "Night " + numeral;
    };

  }

  save () {
    this.timer.save();
  }

  reinstantiate (timer, players) {
    this.timer = timer;
    this.players = players;

    for (var i = 0; i < players.length; i++) {
      players[i].reinstantiate(this);
    };

    if (this.players_tracked !== players.length) {
      console.warn("The players' save files have been removed/deleted!");
    };

    this.players_tracked = players.length;

    this.actions.reinstantiate(this);
    this.instantiateTrialVoteCollector();
  }

  addAction () {
    // Inherits
    return this.actions.add(arguments);
  }

  getPlayerMatch (name) {
    // Check if name is alphabet

    var player = this.getPlayerByAlphabet(name);

    if (player === null) {

      var guild = this.client.guilds.get(this.config["server-id"]);
      var distances = new Array();

      for (var i = 0; i < this.players.length; i++) {

        var member = guild.members.get(this.players[i].id);

        var nickname = member.displayName;
        var username = member.user.username;

        // Calculate Levenshtein Distance
        var distance = Math.min(levenshteinDistance(name, nickname), levenshteinDistance(name, username));
        distances.push(distance);

      };

      // Compare distances
      var best_match_index = distances.indexOf(Math.min.apply(null, arr));

      var score = distances[best_match_index];
      player = this.players[best_match_index];

    } else {

      var score = -1;

    };

    return {"score": score, "player": player};

  }

};

function levenshteinDistance (s, t) {

    if (!s.length) return t.length;
    if (!t.length) return s.length;

    return Math.min(
        levenshteinDistance(s.substr(1), t) + 1,
        levenshteinDistance(t.substr(1), s) + 1,
        levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;

};

function flipObject (object) {
  var entries = Object.entries(object);
  var ret = new Object();

  for (var i = 0; i < entries.length; i++) {
    ret[entries[i][1]] = entries[i][0];
  };

  return ret;

};
