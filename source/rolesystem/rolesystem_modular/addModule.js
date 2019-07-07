var hasModule = require("./hasModule.js");

module.exports = function (player, attribute_name, increment=1) {

  if (hasModule(player, attribute_name)) {

    var attribute = player.attributes.find(x => x.attribute.modular && x.attribute.name.toLowerCase() === name.toLowerCase());

    if (attribute.tags.uses !== Infinity) {
      attribute.tags.uses += increment;
    };

  } else {

    // Add module
    player.addAttribute(attribute_name, Infinity, {uses: increment});

  };

};
