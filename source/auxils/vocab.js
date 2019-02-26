module.exports = function (type, amount) {

  switch (type) {

    case "s":
      if (amount === 1) {
        return "";
      } else {
        return "s";
      };

      break;

    case "!s":
      if (amount === 1) {
        return "s";
      } else {
        return "";
      };

      break;

    case "es":
      if (amount === 1) {
        return "";
      } else {
        return "es";
      };

        break;

    case "is":
      if (amount === 1) {
        return "is";
      } else {
        return "are";
      };

      break;

    case "was":
      if (amount === 1) {
        return "was";
      } else {
        return "were";
      };

      break;

    case "has":
      if (amount === 1) {
        return "has";
      } else {
        return "have";
      };

      break;

    default:
      return "";

      break;

  };

};
