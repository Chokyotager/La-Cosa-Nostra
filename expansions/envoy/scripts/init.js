module.exports = function (lcn, version) {

  // Set systems
  lcn.win_conditions["town"].ELIMINATED.push("envoy");
  lcn.win_conditions["mafia"].ELIMINATED.push("envoy");

};
