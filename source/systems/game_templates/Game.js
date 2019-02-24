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
var flavours = require("../flavours.js");

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

    this.trial_vote_operations = new Array();

    this.players_tracked = players.length;

    this.fast_forward_votes = new Array();

    this.channels = new Object();

    this.period_log = new Object();

    this.intro_messages = new Array();

    this.period = this.config["game"]["day-zero"] ? 0 : 1;
    this.steps = 0;
    this.state = "pre-game";

    this.flavour_identifier = this.config["playing"]["flavour"];

    this.voting_halted = false;

    // Timezone is GMT relative
    this.timezone = this.config.time.timezone;

    this.primeDesignatedTime();

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].setGame(this);
      this.players[i].postGameInit();
    };

    return this;

  }

  primeDesignatedTime () {
    // Always start day zero at closest 12pm/am
    var current = new Date();

    var hours = (12 - this.timezone) % 24;

    if (hours <= current.getUTCHours()) {
      // Next one at 00:00
      hours += 12;
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

  getChannelById (id) {
    var guild = this.getGuild();

    return guild.channels.get(id);
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

      if (i < 1 || !remove_extra) {
        executable.misc.clearReactions(this, channel_id, messages_id[i]);
      };

      if (i > 0 && remove_extra) {
        executable.misc.deleteMessage(this, channel_id, messages_id[i]);
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

    if (alphabet === "nl") {

      if (!this.config["game"]["lynch"]["no-lynch-option"]) {
        console.log(user.id + " tried voting no-lynch using the reaction poll but no-lynches are disabled!");
        await user.send(":x: The no-lynch vote is disabled.");
        return null;
      };

      var voted_against = "nl";

    } else {

      var voted_against = this.getPlayerByAlphabet(alphabet);

      if (voted_against === null) {
        return null;
      };

      // Bug check
      if (!voted_against.status.alive) {
        console.log("Dead player voted on!");
        await user.send(":x: You voted on a dead player! Sorry man, but the dude is already dead!");
        return null;
      };

    };

    this.toggleVote(voter, voted_against);

  }

  toggleVote (voter, voted_against) {
    // Post corresponding messages

    if (this.voting_halted) {
      return false;
    };

    var no_lynch_vote = voted_against === "nl";
    var voted_no_lynch = this.isVotingNoLynch(voter.identifier);

    var magnitude = voter.getVoteMagnitude();

    if (no_lynch_vote) {

      // NL vote is independent
      var has_voted = this.votesFrom(voter.identifier).length > 0;

      if (has_voted) {
        return false;
      };

      var before_votes = this.getNoLynchVoteCount();

      // Count NL vote
      if (voted_no_lynch) {
        // Remove no-lynch vote
        this.clearNoLynchVotesBy(voter.identifier);
        executable.misc.removedNolynch(this, voter);
      } else {
        this.addNoLynchVote(voter.identifier, magnitude);
        executable.misc.addedNolynch(this, voter);
      };

      var after_votes = this.getNoLynchVoteCount();

      this.__checkLynchAnnouncement("nl", before_votes, after_votes);

    } else {

      if (voted_no_lynch) {
        return false;
      };

      var already_voting = voted_against.isVotedAgainstBy(voter.identifier);

      if (!already_voting && this.votesFrom(voter.identifier).length >= this.getLynchesAvailable()) {
        // New vote, check if exceeds limit
        return false;
      };

      var before_votes = voted_against.countVotes();

      var toggle_on = voted_against.toggleVotes(voter.identifier, magnitude);

      var after_votes = voted_against.countVotes();

      if (toggle_on) {
        // New vote
        // OLD SYSTEM: uses IDs directly
        executable.misc.addedLynch(this, voter, voted_against);
      } else {
        executable.misc.removedLynch(this, voter, voted_against);
      };

      this.__checkLynchAnnouncement(voted_against.identifier, before_votes, after_votes);

    };

    this.__reloadTrialVoteMessage();

    // Save file
    this.save();

    if (this.hammerActive()) {
      this.__checkLynchHammer();
    };

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

    if (identifier === "nl") {
      var required = this.getNoLynchVotesRequired();
    } else {
      var required = this.getVotesRequired() - role.getVoteOffset();
    };

    // !this.config["game"]["lynch"]["top-voted-lynch"] && !this.hammerActive()
    if (!this.hammerActive() && !this.config["game"]["lynch"]["top-voted-lynch"]) {

      if (before < required && after >= required) {
        // New lynch
        identifier === "nl" ? executable.misc.nolynchReached(this) : executable.misc.lynchReached(this, role);
      } else if (before >= required && after < required) {
        identifier === "nl" ? executable.misc.nolynchOff(this) : executable.misc.lynchOff(this, role);
      };

    };

  }

  __checkLynchHammer () {

    var no_lynch_votes = this.getNoLynchVoteCount();

    if (no_lynch_votes >= this.getNoLynchVotesRequired()) {
      this.fastforward();
      return true;
    };

    // Checks for all potential hammers
    for (var i = 0; i < this.players.length; i++) {
      var votes = this.players[i].countVotes();
      var required = this.getVotesRequired() - this.players[i].getVoteOffset();

      if (votes >= required) {
        // Execute the player
        //var success = this.lynch(this.players[i]);

        // Fastforward cycle
        this.fastforward();
        return true;

      };

    };

    return false;

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

  async step (adjust_to_current_time=false) {
    // Synced with Timer class
    // Should return next date

    // this.config.time.day

    this.voting_halted = true;

    var addition = this.state === "pre-game" ? 0 : 1;

    if (adjust_to_current_time) {

      this.current_time = new Date();

      var time = new Date();
      time.setUTCHours(time.getUTCHours() + 1, 0, 0, 0);

      this.next_action = calculateNextAction(time, this.period + addition, this.config);

    } else {
      this.current_time = new Date(this.next_action);
      this.next_action = calculateNextAction(this.next_action, this.period + addition, this.config);
    };

    if (this.state === "pre-game") {

      this.__routines();
      this.cycle();
      this.__start();

      // Periodic updates are handled in roles/postRoleIntroduction
      // because of async issues

      // Player routines in start
      //this.__playerRoutines();

      this.execute("postcycle", {period: this.period});

    } else if (this.state === "playing") {

      // Print period in private channel
      await this.messagePeriodicUpdate(1);

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
      await this.__playerRoutines();

      this.execute("postcycle", {period: this.period});

    } else {

      return null;

    };

    // Save
    this.save();

    this.voting_halted = false;

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

  async fastforward () {

    this.voting_halted = true;

    return await this.timer.fastforward();

  }

  async precycle () {

    this.clearPeriodPins();

    if (this.period % 2 === 0) {

      await executable.misc.editTrialVote(this, true);
      this.clearTrialVoteReactions();

      // Dusk
      this.checkLynches();
      this.clearVotes();

    };

    this.execute("cycle", {period: this.period});
    this.enterDeathMessages();
    this.sendMessages();

  }

  async messagePeriodicUpdate (offset=0) {
    await this.messageAll("~~                                              ~~    **" + this.getFormattedDay(offset) + "**", "permanent");
  }

  async messageAll (message, pin=false) {
    for (var i = 0; i < this.players.length; i++) {

      await new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve();
        }, 100)
      });

      if (this.players[i].isAlive()) {

        var channel = this.players[i].getPrivateChannel();

        if (pin === "period") {

          this.sendPeriodPin(channel, message);

        } else if (pin === "permanent") {

          this.sendPin(channel, message);

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
      executable.misc.postMafiaPeriodicMessage(this);
    };

    executable.misc.openMainChats(this);

  }

  night () {
    // Executed at the start of nighttime

    // Lynch players
    executable.misc.openMafiaChat(this);
    executable.misc.postMafiaPeriodicMessage(this);

    if (!this.config["game"]["town"]["night-chat"]) {
      executable.misc.lockMainChats(this);
    } else {
      executable.misc.openMainChats(this);
    };


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

  createPin (message) {

    var result = executable.misc.pinMessage(message);

    return result;

  }

  async sendPeriodPin (channel, message) {

    var out = await channel.send(message);
    this.createPeriodPin(out);

  }

  async sendPin (channel, message) {

    var out = await channel.send(message);
    this.createPin(out);

  }

  checkLynches () {

    // Find players who will be lynched

    var lynchable = new Array();

    for (var i = 0; i < this.players.length; i++) {

      if (!this.players[i].isAlive()) {
        continue;
      };

      var votes = this.players[i].countVotes();
      var required = this.getVotesRequired() - this.players[i].getVoteOffset();

      var top_voted_lynch = this.config["game"]["lynch"]["top-voted-lynch"] && votes >= this.config["game"]["lynch"]["top-voted-lynch-minimum-votes"];

      if (votes >= required || top_voted_lynch) {
        // Execute the player
        //var success = this.lynch(this.players[i]);

        lynchable.push({player: this.players[i], score: votes - required, votes: votes});

      };

    };

    var lynches_available = this.getLynchesAvailable();

    lynchable = auxils.cryptographicShuffle(lynchable);

    lynchable.sort(function (a, b) {
      return b.score - a.score;
    });

    var lynched = new Array();
    var no_lynch_votes = this.getNoLynchVoteCount();
    var top_voted_lynch = this.config["game"]["lynch"]["top-voted-lynch"];

    // Check no-lynch
    if (no_lynch_votes < this.getNoLynchVotesRequired() || top_voted_lynch) {

      while (lynchable.length > 0 && lynches_available > lynched.length) {

        var score = lynchable[0].score;
        var votes = lynchable[0].votes;
        var target = lynchable[0].player;

        // Checks popularity of no lynch votes
        if (votes <= no_lynch_votes) {
          break;
        };

        // Encased in loop in event of > 2 lynches available and second-ups are tied
        if (lynchable.filter(x => x.score === score).length > (lynches_available - lynched.length) && !this.config["game"]["lynch"]["tied-random"]) {
          // Stop further lynch
          break;
        };

        var success = this.lynch(target);

        if (success) {
          lynched.push(target);
        };

        lynchable.splice(0, 1);

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
      this.silentKill(role, "__lynched__");
    };

    return success;

  }

  kill (role, reason, secondary_reason, broadcast_position_offset=0) {

    // Secondary reason is what the player sees
    // Can be used to mask death but show true
    // reason of death to the player killed
    this.silentKill(...arguments);

    if (this.getPeriodLog() && this.getPeriodLog().trial_vote) {
      this.clearAllVotesFromAndTo(role.identifier);
      this.__reloadTrialVoteMessage();
      this.__checkLynchHammer();
    };

  }

  silentKill (role, reason, secondary_reason, broadcast_position_offset=0) {

    // Work in progress, should remove emote
    /*
    if (this.getPeriodLog() && this.getPeriodLog().trial_vote) {
      executable.misc.removePlayerEmote(this, role.identifier);
    };
    */

    // Secondary reason is what the player sees
    // Can be used to mask death but show true
    // reason of death to the player killed
    this.execute("killed", {target: role.identifier});
    executable.misc.kill(this, role);
    this.primeDeathMessages(role, reason, secondary_reason, broadcast_position_offset);

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

  enterDeathMessages (offset=0) {
    var log = this.getPeriodLog(offset);


    // {role, reason}
    var registers = Array.from(log.death_messages);

    var messages = new Object();

    for (var i = 0; i < registers.length; i++) {

      var identifier = registers[i].role;

      if (!messages[identifier]) {
        messages[identifier] = new Array();
      };

      messages[identifier].push(registers[i].reason);

    };

    var keys = Object.keys(messages);

    for (var i = 0; i < keys.length; i++) {
      var identifier = keys[i];
      var role = this.getPlayerByIdentifier(identifier);
      var reason = auxils.pettyFormat(messages[keys[i]]);

      var message = executable.misc.getDeathMessage(this, role, reason);

      this.addMessage(role, message);
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

    var cause_of_death_config = this.config["game"]["cause-of-death"];
    var exceptions = cause_of_death_config["exceptions"];

    var hide_day = (cause_of_death_config["hide-day"] && this.isDay());
    var hide_night = (cause_of_death_config["hide-night"] && !this.isDay());

    for (var i = 0; i < unique.length; i++) {

      var role = this.getPlayerByIdentifier(unique[i]);

      var reasons = new Array();

      for (var j = 0; j < registers.length; j++) {

        if (registers[j].role === unique[i]) {

          var exempt = false;

          // TODO: fix
          for (var k = 0; k < exceptions.length; k++) {
            if (registers[j].reason.includes(exceptions[k])) {
              exempt = true;
              break;
            };
          };

          if (hide_day || hide_night || exempt) {
            reasons.push(registers[j].reason);
          };

        };

      };

      if (reasons.length < 1) {
        reasons.push("found dead");
      };

      var reason = auxils.pettyFormat(reasons);

      var message = executable.misc.getDeathBroadcast(this, role, reason);

      this.addBroadcastSummary(message, offset);

    };

    this.uploadPublicRoleInformation(unique);

  }

  uploadPublicRoleInformation (role_identifiers, ignore_cleaned=true) {

    var display = new Array();

    for (var i = 0; i < role_identifiers.length; i++) {
      var player = this.getPlayerByIdentifier(role_identifiers[i]);

      if (!player.misc.role_cleaned) {
        display.push(player);
      };

    };

    executable.roles.uploadPublicRoleInformation(this, display);

  }

  addDeathBroadcast (role, reason, position_offset=0) {

    var log = this.getPeriodLog();

    log.death_broadcasts.push({role: role.identifier, reason: reason, position_offset: position_offset});

  }

  addBroadcastSummary (message, offset=0) {
    var log = this.getPeriodLog(offset);

    log.summary.push({message: message, time: new Date()});
  }

  addDeathMessage (role, reason) {
    var log = this.getPeriodLog();

    log.death_messages.push({role: role.identifier, reason: reason});
  }

  addMessage (role, message) {
    var log = this.getPeriodLog();

    log.messages.push({message: message, recipient: role.identifier, time: new Date()});
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

  async sendMessages (offset=0) {

    // Actually sends messages

    var log = this.getPeriodLog(offset);

    var messages = log.messages;

    for (var i = 0; i < messages.length; i++) {

      var message = messages[i].message;

      executable.misc.sendIndivMessage(this, messages[i].recipient, message);

      await new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve();
        }, 80);
      });

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

    if (!this.isDay() && !this.config["game"]["town"]["night-chat"]) {

      executable.misc.lockMainChats(this);

    } else {

      executable.misc.openMainChats(this);

    };

  }

  __routines () {
    // Check day night cycles, also used on referesh
    // Should not put post functions in here,
    // only administrative junk

    var trials = Math.max(this.config["game"]["minimum-trials"], Math.ceil(this.config["game"]["lynch-ratio-floored"] * this.getAlive()));

    // Clear fast forward votes
    this.fast_forward_votes = new Array();

    for (var i = 0; i < this.trial_vote_operations.length; i++) {
      var operation = this.trial_vote_operations[i].operation;
      trials = auxils.operations[operation](trials, this.trial_vote_operations[i].amount);
    };

    // Clear TV operations
    this.trial_vote_operations = new Array();

    this.period_log[this.period.toString()] = {
      "trials": trials,
      "summary": new Array(),
      "death_broadcasts": new Array(),
      "death_messages": new Array(),
      "messages": new Array(),
      "trial_vote": null,
      "no_lynch_vote": new Array(),
      "period": this.period,
      "pins": new Array()
    };

  }

  addTrialVoteOperation (operation, amount) {

    var allowed = ["addition", "subtraction", "multiplication", "division", "modulo", "max", "min"];

    if (!allowed.includes(operation)) {
      var err = new Error("Operation " + operation + " is not allowed!");
      throw err;
    };

    this.trial_vote_operations.push({operation: operation, amount: amount})

  }

  async __playerRoutines () {
    for (var i = 0; i < this.players.length; i++) {
      await new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve();
        }, 100);
      });
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

    // Floored of alive
    //return 1;
    return Math.max(this.config["game"]["minimum-lynch-votes"], Math.floor(alive / 2) + 1);

  }

  getNoLynchVotesRequired () {

    var alive = this.getAlive();

    // Ceiled of alive
    return Math.max(this.config["game"]["minimum-nolynch-votes"], Math.ceil(alive / 2));

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

    var flavour = this.getGameFlavour();

    if (flavour && flavour.info["step-names"]) {
      var step_names = flavour.info["step-names"];
      var step = this.getStep() + offset;

      var index = step % step_names.length;

      return step_names[index] + " " + numeral;
    };

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

    // Check role/attribute incompatibility
    var incompatible = new Array();
    for (var i = 0; i < players.length; i++) {
      incompatible = incompatible.concat(players[i].verifyProperties());
    };

    if (this.flavour_identifier && !flavours[this.flavour_identifier]) {
      incompatible = incompatible.concat({type: "flavour", identifier: this.flavour_identifier});
    };

    if (incompatible.length > 0) {

      var errors = [{type: "role", items: auxils.getUniqueArray(incompatible.filter(x => x.type === "role").map(x => x.identifier))}, {type: "attribute", items: auxils.getUniqueArray(incompatible.filter(x => x.type === "attribute").map(x => x.identifier))}, {type: "flavour", items: auxils.getUniqueArray(incompatible.filter(x => x.type === "flavour").map(x => x.identifier))}];

      for (var i = 0; i < errors.length; i++) {

        if (errors[i].items.length > 0) {
          console.log("\nError loading type " + errors[i].type + ":");
          console.table(errors[i].items);
        };

      };

      console.log("\nStopped save reload due to role/attribute incompatibilities. Make sure expansions required for this save can be loaded (you can also check config/playing.json's \"expansions\" field). Restart the bot when ready. Key \"uninstantiate\" to delete saves.\n");

      return false;
    };

    for (var i = 0; i < players.length; i++) {
      players[i].reinstantiate(this);
    };

    if (this.players_tracked !== players.length) {
      console.warn("The players' save files have been removed/deleted!");
    };

    this.players_tracked = players.length;

    this.actions.reinstantiate(this);
    this.instantiateTrialVoteCollector();

    return true;
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
          distances.push(-1);
          continue;
        };

        var nickname = member.displayName;
        var username = member.user.username;

        // Calculate Levenshtein Distance
        // Ratio'd

        var s_username = auxils.hybridisedStringComparison(name.toLowerCase(), username.toLowerCase());
        var s_nickname = auxils.hybridisedStringComparison(name.toLowerCase(), nickname.toLowerCase());

        var distance = Math.max(s_username, s_nickname);
        distances.push(distance);

      };

      // Compare distances
      var best_match_index = distances.indexOf(Math.max(...distances));

      var score = distances[best_match_index];
      player = this.players[best_match_index];

    } else {

      var score = Infinity;

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

    this.getMainChannel().send(this.config["messages"]["game-over"]);

    this.clearTrialVoteReactions();

    // End the game
    this.state = "ended";

    this.timer.updatePresence();

  }

  getGuild () {
    return this.client.guilds.get(this.config["server-id"]);
  }

  postWinLog() {
    if (this.win_log) {
      executable.misc.postWinLog(this, this.win_log.faction, this.win_log.caption);
    } else {
      console.warn("The win log has not been primed!");
    };
  }

  primeWinLog (faction, caption) {
    this.win_log = {faction: faction, caption: caption};
  }

  getLogChannel () {
    return this.getGuild().channels.find(x => x.name === this.config["channels"]["log"]);
  }

  getMainChannel () {
    return this.getGuild().channels.find(x => x.name === this.config["channels"]["main"]);
  }

  getWhisperLogChannel () {
    return this.getGuild().channels.find(x => x.name === this.config["channels"]["whisper-log"]);
  }

  getPeriod () {
    return this.period;
  }

  getStep () {
    return this.steps;
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

      var amount = Math.min(lynches - this.votesFrom(player.identifier).length, votes.length);
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

  getGameFlavour () {
    var config = this.config;

    var flavour_identifier = this.flavour_identifier;

    if (!flavour_identifier) {
      // No flavour
      return null;
    };

    var flavour = flavours[flavour_identifier];

    if (!flavour) {
      console.warn("Invalid flavour " + flavour_identifier + "! Defaulting to no flavour.");
      return null;
    };

    return flavour;
  }

  addFastForwardVote (identifier) {

    if (this.votedFastForward(identifier)) {
      return null;
    };

    this.fast_forward_votes.push(identifier);
  }

  removeFastForwardVote (identifier) {

    if (!this.votedFastForward(identifier)) {
      return null;
    };

    this.fast_forward_votes = this.fast_forward_votes.filter(x => x !== identifier);
  }

  votedFastForward (identifier) {
    return this.fast_forward_votes.includes(identifier);
  }

  checkFastForward () {
    // Wrt to the configuration

    var alive_count = this.getAlive();

    var minimum = Math.ceil(alive_count * this.config["game"]["fast-forwarding"]["ratio"]);

    var ff_votes = this.fast_forward_votes;

    // Confirm that all players are alive
    ff_votes = ff_votes.filter(x => this.getPlayerByIdentifier(x).isAlive());

    var ratio = ff_votes.length/alive_count;
    var percentage = Math.round(ratio * 1000)/10;

    if (ff_votes.length >= minimum) {
      // Fast forward the game
      this.addBroadcastSummary("The game has been **fastforwarded** with __" + percentage + "%__ of alive players voting for such last cycle.");
      this.fastforward();
    };

  }

  checkRole (condition) {

    if (typeof condition === "function") {
      // Check
      return this.exists(condition);
    } else if (typeof condition === "string") {

      condition = condition.toLowerCase();

      // Check separately
      var cond1 = this.exists(x => x.isAlive() && x.role_identifier === condition);
      var cond2 = this.exists(x => x.isAlive() && x.role.alignment === condition);
      var cond3 = this.exists(x => x.isAlive() && x.role.class === condition);

      var cond4 = false;

      if (condition.includes("-")) {
        condition = condition.split("-");
        var cond4 = this.exists(x => x.isAlive() && x.role.alignment === condition[0] && x.role.class === condition[1]);
      };

      return cond1 || cond2 || cond3 || cond4;

    } else {
      return null;
    };

  }

  checkRoles (conditions) {

    var ret = false;

    for (var i = 0; i < conditions.length; i++) {
      ret = ret || this.checkRole(conditions[i]);
    };

    return ret;
  }

  getNoLynchVoters () {

    var ret = new Array();
    var no_lynch_vote = this.getPeriodLog()["no_lynch_vote"];

    // {identifier, magnitude}

    for (var i = 0; i < no_lynch_vote.length; i++) {
      ret.push(no_lynch_vote[i].identifier);
    };

    return ret;

  }

  getNoLynchVoteCount () {

    var count = new Number();
    var no_lynch_vote = this.getPeriodLog()["no_lynch_vote"];

    for (var i = 0; i < no_lynch_vote.length; i++) {
      count += no_lynch_vote[i].magnitude;
    };

    return count;

  }

  addNoLynchVote (identifier, magnitude) {
    var no_lynch_vote = this.getPeriodLog()["no_lynch_vote"];

    no_lynch_vote.push({identifier: identifier, magnitude: magnitude});
  }

  clearNoLynchVotesBy (identifier) {

    var no_lynch_vote = this.getPeriodLog()["no_lynch_vote"];

    var cleared = false;

    for (var i = no_lynch_vote.length - 1; i >= 0; i--) {
      if (no_lynch_vote[i].identifier === identifier) {
        no_lynch_vote.splice(i, 1);
        cleared = true;
      };
    };

    return cleared;

  }

  clearNoLynchVotes () {
    this.getPeriodLog()["no_lynch_vote"] = new Array();
  }

  isVotingNoLynch (identifier) {
    return this.getNoLynchVoters().includes(identifier);
  }

  hammerActive () {

    var trials_available = this.getTrialsAvailable();

    return this.config["game"]["lynch"]["allow-hammer"] && (trials_available < 2);

  }

  getTrialsAvailable () {

    var period_log = this.getPeriodLog();
    return period_log ? period_log["trials"] : Math.max(this.config["game"]["minimum-trials"], Math.ceil(this.config["game"]["lynch-ratio-floored"] * this.getAlive()));

  }

  clearAllVotesOn (identifier) {
    var player = this.getPlayerByIdentifier(identifier);

    player.clearVotes();
  }

  clearAllVotesFromAndTo (identifier) {

    // Stops votes to and from player
    this.clearNoLynchVotesBy(identifier);
    this.clearAllVotesBy(identifier);
    this.clearAllVotesOn(identifier);

  }

  addIntroMessage (channel_id, message) {

    this.intro_messages.push({channel_id: channel_id, message: message});

  }

  async postIntroMessages () {

    for (var i = 0; i < this.intro_messages.length; i++) {

      var channel = this.getChannelById(this.intro_messages[i].channel_id);
      await channel.send(this.intro_messages[i].message);

    };

  }

};
