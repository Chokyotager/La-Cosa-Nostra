// Rule filter function

module.exports = function (sample, rules) {

  if (!sample || !rules) {
    return sample;
  };

  var final = Array.from(sample);

  /*
  - - exlcusion criteria
  [] - inclusion criteria
  + - exception criteria
  */

  // Run filter
  for (var i = 0; i < rules.length; i++) {

    var rule = rules[i];
    var catchable = wildcard(rule);

    switch (true) {

      case rule.startsWith("-"):
        // Scan through current sample and exclude
        final = final.filter(x => !x.match(catchable));
        break;

      case rule.startsWith("+"):
        // Scan through current sample and except
        final = final.filter(x => x.match(catchable));
        break;

      default:
        // Scan through first sample and include
        var include = sample.filter(x => x.match(catchable));
        for (var j = 0; j < include.length; j++) {

          if (final.some(x => x === include[j])) {
            continue;
          };

          final = final.concat(include);

        };
        break;

    };

  };

  return final;

};

function wildcard (str) {

  if (str.startsWith("-") || str.startsWith("+")) {
    str = str.substring(1, str.length);
  };

  str = str.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

  var reg = str.replace("*", "(?:)");
  return new RegExp(reg, "gi");

};
