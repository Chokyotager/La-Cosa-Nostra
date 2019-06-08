var Discord = require("discord.js");

module.exports = function (actionable, game, params) {

  var voter = game.getPlayerByIdentifier(params.voter);

  game.getMainChannel().send(":scales: **" + voter.getDisplayName() + "** has __voted against__ the **Arbiter God**.");

  // Check for arbiter god death
  var votes_required = game.getVotesRequired();
  var vote_count = game.getSpecialVoteCount("arbiter_god");

  if ((vote_count >= Math.floor(votes_required / 2)) && !game.arbiter_god_previously_warned) {

    game.sendPeriodPin(game.getMainChannel(), "*After **" + voter.getDisplayName() + "** places his vote against the Arbiter God there was a resounding thud. With his gavel now resting squarely on the block, the Arbiter God raised himself from his chair and towered over those gathered.*\n\n\"How dare you question my authority.\" *His voice boomed over the floor.* \"I am completely neutral in all matters, and without me this Duvocation would fall apart. I suggest you reconsider your choices.\"\n\n*With that he returns to his seat, and conversation gradually continues.*");
    game.arbiter_god_previously_warned = true;

  };

  if (vote_count >= votes_required) {

    lynchAG();

  };

  async function lynchAG () {

    var lcn = require("../../../../source/lcn.js");
    var assets = lcn.assets;

    // Execute the arbiter god
    game.voting_halted = true;
    game.arbiter_god_alive = false;
    game.arbiter_god_lynched = game.getStep();

    game.addBroadcastSummary("**The Arbiter God** was banished.\nThey brought peace to the Duvocation - now all that's left is chaos.");

    game.setGameConfigOverride({"lynch": {
          "top-voted-lynch": true,
          "top-voted-lynch-minimum-votes": 0,

          "tied-random": false,

          "allow-hammer": true,
          "no-lynch-option": false
        }});

    game.addAction("g/gift/follower_of_3", ["cycle"], {
      from: "*",
      to: "*",
      expiry: 1
    });

    await game.getRolesChannel().send(new Discord.Attachment(assets["arbiter-god.png"], "arbiter-god.png"));
    await game.getRolesChannel().send("**The Arbiter God**\n```fix\nThe Arbiter God presides over the trials.\n\nWithout the Arbiter God, top-voted-lynches and hammer votes are enabled permanently with no option of no-lynching effective immediately. If two or more players are tied in the trial and a hammer is not reached, it will default to a no-lynch.```");

    var original_singular_lynch_message = game.config.messages["singular-lynch"];
    var original_plural_lynch_message = game.config.messages["plural-lynch"];

    game.config.messages["singular-lynch"] = ":skull_crossbones: As he leaves, the Arbiter God's eyes spark with rage and he kills {;player}, fulfilling his sense of justice, and perhaps achieving the end the vote should have had.";
    game.config.messages["plural-lynch"] = ":skull_crossbones: As he leaves, the Arbiter God's eyes spark with rage and he kills {;players}, fulfilling his sense of justice, and perhaps achieving the end the vote should have had.";

    await game.fastforward();

    game.config.messages["singular-lynch"] = original_singular_lynch_message;
    game.config.messages["plural-lynch"] = original_plural_lynch_message;

  };

};
