// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.joat_actions_left = 4;

  player.misc.joat_usable = [{
    "command": "kill",
    "description": "Deals your target a Basic attack.",
    "condition": "Target is killed."
  }, {
    "command": "blockvote",
    "description": "Blocks the vote of your target the next day.",
    "condition": "Target's vote is successfully blocked, and they do not die that night."
  }, {
    "command": "influencevote",
    "description": "Doubles your targets' vote strength the next day.",
    "condition": "Target's vote is successfully doubled, and they do not die that night."
  }, {
    "command": "interrogate",
    "description": "Presents you with your targets' alignment the next day.",
    "condition": "Successfully interrogate your target, and your taget does not die that night."
  }, {
    "command": "investigate",
    "description": "Presents you with your targets' role (or possibilities of role) the next day.",
    "condition": "Successfully investigate your target, and your taget does not die that night."
  }, {
    "command": "roleblock",
    "description": "Prevents your target from using their night action.",
    "condition": "Successfully roleblock your target. Target does not have to be alive the next day for this to be counted."
  }, {
    "command": "protect",
    "description": "Grants your target a Powerful defense for the night. Does not cure them of poison (if applicable).",
    "condition": "Successfully protect your target. If your target was dealt multiple attacks which you are able to fend against, each attack counts as one successfully executed action."
  }, {
    "command": "watch",
    "description": "Watch your target to see who they visit and who visits them.",
    "condition": "Successfully watch a target which has a minimum of two people visiting (yourself included)."
  }];

};
