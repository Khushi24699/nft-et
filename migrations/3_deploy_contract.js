var Market = artifacts.require("./Tokenmarket.sol");

module.exports = function(deployer) {
    deployer.deploy(Market, "0xF41ACFAbFA591927bcb0B2aadf706f08Fa27a9Aa");
};