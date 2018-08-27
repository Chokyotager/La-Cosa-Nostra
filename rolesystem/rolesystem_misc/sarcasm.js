var remarks = [
  "What are you even thinking?",
  "Are you joking me?",
  "Like, what?",
  "C'mon dude.",
  "Do you understand stuff bruh.",
  "*Facepalm*.",
  "Eyaaaaah.",
  "Wut.",
  "Really, dude?",
  "Seriously? Are you trying that."
]

module.exports = function (prepend_space=false) {

  // Inserts a sarcastic remark

  var index = Math.floor(Math.random() * remarks.length);

  return prepend_space ? " " + remarks[index] : remarks[index];
};
