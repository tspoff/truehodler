const CoinCore = artifacts.require('./CoinCore.sol');
const GeneScienceTest = artifacts.require('./GeneScienceTest.sol');
const SaleClockAuction = artifacts.require('./SaleClockAuction.sol');

module.exports = async function (deployer) {

  let coinInstance;
  deployer.deploy(CoinCore).then(function () {
    return CoinCore.deployed().then(function (deployed) {
      coinInstance = deployed;
      return deployer.deploy(GeneScienceTest).then(function () {
        return deployer.deploy(SaleClockAuction, coinInstance.address, 10).then(function () {
          //do something else
        })
      })
    })
  })
}
