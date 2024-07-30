const REC = artifacts.require("REC");

module.exports = function(deployer) {
  deployer.deploy(REC, 1000000);
};
