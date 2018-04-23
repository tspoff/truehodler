const CoinCore = artifacts.require('./CoinCore.sol');
const GeneScienceTest = artifacts.require('./GeneScienceTest.sol');
const SaleClockAuction = artifacts.require('./SaleClockAuction.sol');

contract('CoinCore', async function (accounts) {
    let coreInstance, geneScienceInstance, saleAuctionInstance;
    let ceoAddress, cfoAddress, cooAddress;

    const AUCTION_CREATED_EVENT = "AuctionCreated";

    before(async function () {
        coreInstance = await CoinCore.new({ from: accounts[0] });
        geneScienceInstance = await GeneScienceTest.new({ from: accounts[0] });
        saleAuctionInstance = await SaleClockAuction.new(coreInstance.address, 10, { from: accounts[0] });

        await coreInstance.setCEO(accounts[0]);
        await coreInstance.setCFO(accounts[0]);
        await coreInstance.setCOO(accounts[0]);

        ceoAddress = await coreInstance.getCEO.call({ from: accounts[0] });
        cfoAddress = await coreInstance.getCFO.call({ from: accounts[0] });
        cooAddress = await coreInstance.getCOO.call({ from: accounts[0] });

        await coreInstance.setGeneScienceAddress(geneScienceInstance.address, { from: accounts[0] });
        await coreInstance.setSaleAuctionAddress(saleAuctionInstance.address, { from: accounts[0] });

        await coreInstance.unpause({ from: ceoAddress });

    });

    it('creates a gen0 auction', async function () {
        let txResult;

        txResult = await coreInstance.createGen0Auction(0, { from: cooAddress });
        //txResult = await saleAuctionInstance.getAuction(postTxCoinCount - 1, {from: cooAddress});
    });

    //cancels an auction

    //bids on an auction

    //has highest bidder win auction

});
