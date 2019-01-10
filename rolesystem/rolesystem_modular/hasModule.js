module.exports = function (player, name, category) {

  var attributes = player.attributes;

  if (category) {

    return attributes.some(x => x.attribute.modular && x.attribute.name.toLowerCase() === name.toLowerCase() && x.attribute["modular-details"]["cluster"].toLowerCase() === category.toLowerCase());

  } else {

    return attributes.some(x => x.attribute.modular && x.attribute.name.toLowerCase() === name.toLowerCase());

  };

};
