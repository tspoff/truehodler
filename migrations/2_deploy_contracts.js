const CoinCore = artifacts.require('./CoinCore.sol');
const GeneScienceTest = artifacts.require('./GeneScienceTest.sol');
const SaleClockAuction = artifacts.require('./SaleClockAuction.sol');

module.exports = async function (deployer) {
  await deployer.deploy(CoinCore);
  const coinInstance = await CoinCore.deployed();
  await deployer.deploy(GeneScienceTest);
  await deployer.deploy(SaleClockAuction, coinInstance.address, 10);
}
