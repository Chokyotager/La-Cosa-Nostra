/*
By the time this instance
is initialised, the roles should
already be defined
*/

var executable = require("../executable.js");
var alphabets = require("../alpha_table.js");

var Actions = require("./Actions.js");
var Player = require("./Player.js");

var auxils = require("../auxils.js");

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
    this.steps = 0;
    this.state = "pre-game";

    // Timezone is GMT relative
    this.timezone = this.config.time.timezone;

    this.primeDesignatedTime();

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].setGame(this);
    };

    return this;

  }

  primeDesignatedTime () {
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
  }

  setChannel (name, channel) {

    // This.channels stores SPECIAL channels,
    // not the private ones
    // not the logging ones either

    this.channels[name] = {id: channel.id, name: channel.name, created_at: channel.createdAt};

  };

  getChannel(name) {
    var guild = this.getGuild();

    if (!this.channels[name]) {
      return undefined;
    };

    return guild.channels.get(this.channels[name].id);
  }

  getPlayerById (id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        return this.players[i];
      };
    };
    return null;
  }

  getPlayerByIdentifier (identifier) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].identifier === identifier) {
        return this.players[i];
      };
    };
    return null;
  }

  getPlayer (argument) {
    // Flexible

    if (argument instanceof Player) {
      return argument;
    };

    var id = this.getPlayerById(argument);
    var identifier = this.getPlayerByIdentifier(argument);

    return id || identifier;

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

    this.save();

    this.instantiateTrialVoteCollector();

    this.loadPreemptiveVotes();

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
      console.log(user.id + " tried to vote on the trial although they are either dead or not in the game!");
      await user.send(":x: You are not alive and in the game, please do not vote in the trials! If you try that again, I will have you kicked.");
      return null;
    };

    var reversed = auxils.flipObject(alphabets);
    var emote = reaction.emoji;

    var alphabet = reversed[emote];

    if (alphabet === undefined) {
      return null;
    };

    // Count the vote
    var voter = this.getPlayerById(user.id);
    var voted_against = this.getPlayerByAlphabet(alphabet);

    // Bug check
    if (!voted_against.status.alive) {
      console.log("Dead player voted on!");
      await user.send(":x: You voted on a dead player! Sorry man, but the dude is already dead!");
      return null;
    };

    if (voted_against === null) {
      return null;
    };

    this.toggleVote(voter, voted_against);

  }

  toggleVote (voter, voted_against) {
    // Post corresponding messages

    var already_voting = voted_against.isVotedAgainstBy(voter.identifier);

    if (!already_voting && this.votesFrom(voter.identifier).length >= this.getLynchesAvailable()) {
      // New vote, check if exceeds limit
      return false;
    };

    var before_votes = voted_against.countVotes();

    var toggle_on = voted_against.toggleVotes(voter.identifier);

    var after_votes = voted_against.countVotes();

    if (toggle_on) {
      // New vote
      // OLD SYSTEM: uses IDs directly
      executable.misc.addedLynch(this, voter, voted_against);
    } else {
      executable.misc.removedLynch(this, voter, voted_against);
    };

    this.__reloadTrialVoteMessage();
    this.__checkLynchAnnouncement(voted_against.identifier, before_votes, after_votes);

    // Save file
    this.save();

    return true;

  }

  getVotesBy (identifier) {

    var ret = new Array();

    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].isVotedAgainstBy(identifier)) {
        ret.push(this.players[i]);
      };
    };

    return ret;
  }

  votesFrom (identifier) {
    // Get everyone someone is voting against

    var roles = new Array();

    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].isVotedAgainstBy(identifier)) {
        roles.push(this.players[i]);
      };
    };

    return roles;

  }

  __checkLynchAnnouncement (identifier, before, after) {

    var role = this.getPlayerByIdentifier(identifier);
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

  clearAllVotesBy (identifier) {
    // Clears all the votes on other people
    // by id specified

    var cleared = false;

    for (var i = 0; i < this.players.length; i++) {
      cleared = cleared || this.players[i].clearVotesBy(identifier);
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
      this.cycle();
      this.__start();

      // Periodic updates are handled in roles/postRoleIntroduction
      // because of async issues

      // Player routines in start
      //this.__playerRoutines();

    } else if (this.state === "playing") {

      // Print period in private channel
      this.messagePeriodicUpdate(1);

      // Handles actions,
      // closes trial votes, etc.
      // i.e. dawn/dusk time
      await this.precycle();

      this.steps += 1;
      this.period += 1;

      // Create period log
      this.__routines();

      // Broadcast
      var broadcast = this.getBroadcast(-1, true);
      await executable.misc.postNewPeriod(this, broadcast);

      // Win check
      this.checkWin();

      if (this.state === "ended") {
        this.save();
        return null;
      };

      // Open Mafia chat, create votes, routine stuff
      this.cycle();

      // Player routines - configurable
      this.__playerRoutines();

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

    this.execute("cycle", {period: this.period});
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

  messagePeriodicUpdate (offset=0) {
    this.messageAll("~~                                              ~~    **" + this.getFormattedDay(offset) + "**");
  }

  messageAll (message, pin=false) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].isAlive()) {

        var channel = this.players[i].getPrivateChannel();

        if (pin) {

          this.sendPeriodPin(channel, message);

        } else {

          this.players[i].getPrivateChannel().send(message);

        };
      };
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

  async sendPeriodPin (channel, message) {

    var out = await channel.send(message);
    this.createPeriodPin(out);

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

    var success = executable.misc.lynch(this, role);

    // Add lynch summary
    if (success) {
      this.primeDeathMessages(role, "__lynched__");
    };

    return success;

  }

  kill (role, reason, secondary_reason, broadcast_position_offset=0) {

    // Secondary reason is what the player sees
    // Can be used to mask death but show true
    // reason of death to the player killed
    this.execute("killed", {target: role.identifier});
    executable.misc.kill(this, role);
    this.primeDeathMessages(role, reason, secondary_reason, broadcast_position_offset);

    if (this.getPeriodLog() && this.getPeriodLog().trial_vote) {
      this.clearAllVotesBy(role.id);
      this.__reloadTrialVoteMessage();
    };

  }

  modkill (id) {

    var role = this.getPlayerById(id);

    if (role === null) {
      return false;
    };

    role.getPrivateChannel().send(":exclamation: You have been removed from the game by a moderator.");

    executable.admin.modkill(this, role);
    return true;

  }

  primeDeathMessages (role, reason, secondary, broadcast_position_offset=0) {
    this.addDeathBroadcast(role, reason, broadcast_position_offset);

    if (secondary) {
      this.addDeathMessage(role, secondary);
    } else {
      this.addDeathMessage(role, reason);
    };

  }

  enterDeathBroadcasts (offset=0) {
    // Enters in from log.death_broadcasts
    var log = this.getPeriodLog(offset);

    var registers = Array.from(log.death_broadcasts);

    registers.sort((a, b) => a.position_offset - b.position_offset);

    var unique = new Array();

    for (var i = 0; i < registers.length; i++) {
      if (!unique.includes(registers[i].role)) {
        unique.push(registers[i].role);
      };
    };

    for (var i = 0; i < unique.length; i++) {

      var role = this.getPlayerById(unique[i]);

      var reasons = new Array();

      for (var j = 0; j < registers.length; j++) {
        if (registers[j].role === unique[i]) {
          reasons.push(registers[j].reason);
        };
      };

      var reason = auxils.pettyFormat(reasons);

      var message = executable.misc.getDeathBroadcast(this, role, reason);

      this.addBroadcastSummary(message, offset);

    };

  }

  addDeathBroadcast (role, reason, position_offset=0) {

    var log = this.getPeriodLog();

    log.death_broadcasts.push({role: role.id, reason: reason, position_offset: position_offset});

  }

  addBroadcastSummary (message, offset=0) {
    var log = this.getPeriodLog(offset);

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

  addMessages (roles, message) {
    for (var i = 0; i < roles.length; i++) {
      this.addMessage(roles[i], message);
    };
  }

  getBroadcast (offset=0, enter=false) {

    if (enter) {
      this.enterDeathBroadcasts(offset);
    };

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

  __start () {

    this.state = "playing";

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].start();
    };

    executable.misc.postGameStart(this);
    executable.misc.openMainChats(this);

  }

  __routines () {
    // Check day night cycles, also used on referesh
    // Should not put post functions in here,
    // only administrative junk

    var trials = Math.max(this.config["game"]["minimum-trials"], Math.ceil(this.config["game"]["lynch-ratio-floored"] * this.getAlive()));

    this.period_log[this.period.toString()] = {
      "trials": trials,
      "summary": new Array(),
      "death_broadcasts": new Array(),
      "messages": new Array(),
      "trial_vote": null,
      "period": this.period,
      "pins": new Array()
    };

  }

  __playerRoutines () {
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
    //return 1;
    return Math.max(this.config["game"]["minimum-lynch-votes"], Math.ceil(alive / 2));

  }

  getDiscordUser (alphabet) {
    var id = this.getPlayerByAlphabet(alphabet);

    return this.client.users.get(id);
  }

  setPresence (presence) {
    executable.misc.updatePresence(this, presence);
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

  async saveAsynchronously () {
    this.save();
  }

  format (string) {
    return executable.misc.__formatter(string);
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
    return this.actions.add(...arguments);
  }

  execute () {
    this.actions.execute(...arguments);
  }

  getPlayerMatch (name) {
    // Check if name is alphabet

    var player = this.getPlayerByAlphabet(name);

    if (player === null) {

      var guild = this.client.guilds.get(this.config["server-id"]);
      var distances = new Array();

      for (var i = 0; i < this.players.length; i++) {

        var member = guild.members.get(this.players[i].id);

        if (member === undefined) {
          distances.push(Infinity);
          continue;
        };

        var nickname = member.displayName;
        var username = member.user.username;

        // Calculate Levenshtein Distance
        // Ratio'd

        var s_username = auxils.levenshteinDistance(name.toLowerCase(), username.toLowerCase()) / username.length;
        var s_nickname = auxils.levenshteinDistance(name.toLowerCase(), nickname.toLowerCase()) / nickname.length;

        var distance = Math.min(s_username, s_nickname);
        distances.push(distance);

      };

      // Compare distances
      var best_match_index = distances.indexOf(Math.min(...distances));

      var score = distances[best_match_index];
      player = this.players[best_match_index];

    } else {

      var score = -1;

    };

    return {"score": score, "player": player};

  }

  find (key, value) {

    for (var i = 0; i < this.players.length; i++) {

      if (typeof key === "function") {
        var condition = key(this.players[i]);

        if (condition) {
          return this.players[i];
        };

      } else {

        if (this.players[i][key] === value) {
          return this.players[i];
        };

      };

    };

    return undefined;

  }

  findAll (key, value) {

    var ret = new Array();

    for (var i = 0; i < this.players.length; i++) {

      if (typeof key === "function") {
        var condition = key(this.players[i]);

        if (condition) {

          ret.push(this.players[i]);

        };

      } else if (this.players[i][key] === value) {

          ret.push(this.players[i]);

        };

    };

    return ret;

  }

  exists (key, value) {
    return this.find(key, value) !== undefined;
  }

  checkWin () {
    executable.wins.checkWin(this);
  }

  endGame () {

    console.log("Game ended!");

    executable.conclusion.endGame(this);

    this.getMainChannel().send(":sunrise_over_mountains: **GAME OVER**");

    // End the game
    this.state = "ended";

    this.timer.updatePresence();

  }

  getGuild () {
    return this.client.guilds.get(this.config["server-id"]);
  }

  postWinLog() {
    executable.misc.postWinLog(this, ...arguments);
  }

  getLogChannel () {
    return this.getGuild().channels.find(x => x.name === this.config["channels"]["log"]);
  }

  getMainChannel () {
    return this.getGuild().channels.find(x => x.name === this.config["channels"]["main"]);
  }

  getPeriod () {
    return this.period;
  }

  getStep () {
    return this.step;
  }

  isDay () {
    return this.getPeriod() % 2 === 0;
  }

  setWin (role) {
    executable.misc.postWinMessage(role);
    role.setWin();
  }

  setWins (roles) {
    for (var i = 0; i < roles.length; i++) {
      this.setWin(roles[i]);
    };
  }

  async createPrivateChannel () {
    return await executable.misc.createPrivateChannel(this, ...arguments);
  }

  postPrimeLog () {
    executable.misc.postPrimeMessage(this);
  }

  postDelayNotice () {
    executable.misc.postDelayNotice(this);
  }

  substitute (id1, id2) {

    var player = this.getPlayerById(id1);
    player.substitute(id2);

  };

  clearPreemptiveVotes () {
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].clearPreemptiveVotes();
    };
  }

  loadPreemptiveVotes (clear_cache=true) {

    var lynches = this.getLynchesAvailable();

    for (var i = 0; i < this.players.length; i++) {

      var player = this.players[i];
      var votes = player.getPreemtiveVotes();

      if (!player.isAlive()) {
        continue;
      };

      var amount = Math.min(lynches - this.votesFrom(player.id).length, votes.length);
      var successes = new Array();

      for (var j = 0; j < votes.length; j++) {

        // Check if player is votable
        var current = this.getPlayerByIdentifier(votes[i]);

        var already_voted = current.isVotedAgainstBy(player.identifier);
        var alive = current.isAlive();

        if (alive && !already_voted) {
          this.toggleVote(player, current);

          successes.push(current);

          if (successes.length >= amount) {
            break;
          };

        };

      };

      if (successes.length > 0) {
        executable.misc.sendPreemptMessage(player, successes);;
      };

    };

    if (clear_cache) {
      this.clearPreemptiveVotes();
    };

  }

};
