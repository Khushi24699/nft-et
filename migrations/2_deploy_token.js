var Token = artifacts.require("./Token.sol");

module.exports = function(deployer) {
    deployer.deploy(Token, "NFT_token", "Nft");
};