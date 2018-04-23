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

        //CoinCore.deployed().setCOO
    });

    it('sets C-level permission levels', async function () {
        await coreInstance.setCEO(accounts[0]);
        await coreInstance.setCFO(accounts[0]);
        await coreInstance.setCOO(accounts[0]);

        ceoAddress = await coreInstance.getCEO.call({ from: accounts[0] });
        cfoAddress = await coreInstance.getCFO.call({ from: accounts[0] });
        cooAddress = await coreInstance.getCOO.call({ from: accounts[0] });

        assert.equal(ceoAddress, accounts[0]);
        assert.equal(cfoAddress, accounts[0]);
        assert.equal(cooAddress, accounts[0]);

    });

    it('sets auction and genetic contract addresses', async function () {
        await coreInstance.setGeneScienceAddress(geneScienceInstance.address, { from: accounts[0] });
        await coreInstance.setSaleAuctionAddress(saleAuctionInstance.address, { from: accounts[0] });

        console.log(coreInstance.address, "CoinCore");
        console.log(geneScienceInstance.address, "GeneScienceTest");
        console.log(saleAuctionInstance.address, "SaleClockAuction");

        let saleAuctionNFT = await saleAuctionInstance.getNonFungibleContract.call({ from: accounts[0] });
        let coreGeneScience = await coreInstance.getGeneScienceAddress.call({ from: accounts[0] });
        let coreSaleAuction = await coreInstance.getSaleAuctionAddress.call({ from: accounts[0] });
        
        assert.equal(saleAuctionNFT, coreInstance.address);
        assert.equal(coreGeneScience, geneScienceInstance.address);
        assert.equal(coreSaleAuction, saleAuctionInstance.address);
    });

    it('starts paused and can be unpaused by CEO', async function() {
        let paused = await coreInstance.isPaused.call();
        assert.equal(paused, true);

        let txResult = await coreInstance.unpause({ from: ceoAddress });

        paused = await coreInstance.isPaused.call();
        assert.equal(paused, false);
    });

    it('creates a promo coin', async function () {
        let preTxCoinCount = await coreInstance.totalSupply.call({ from: accounts[0] });

        await coreInstance.createPromoCoin(0, 1, accounts[0], { from: accounts[0] });
        //Check for emitted event

        let postTxCoinCount = await coreInstance.totalSupply.call({ from: accounts[0] });
        let txCoin = await coreInstance.getCoin(postTxCoinCount - 1, { from: accounts[0] });

        console.log(txCoin);

        assert.equal(preTxCoinCount.toNumber() + 1, postTxCoinCount.toNumber(), "adds coin record");
    });

    it('creates a gen0 coin', async function () {
        let txResult;

        let preTxCoinCount = await coreInstance.totalSupply.call({ from: accounts[0] });
        txResult = await coreInstance.createGen0Auction(0, { from: accounts[0] });

        //Check for newcoin event
        console.log(txResult.logs);

        let postTxCoinCount = await coreInstance.totalSupply.call({ from: accounts[0] });

        txResult = await coreInstance.getCoin(postTxCoinCount - 1, { from: accounts[0] });
        
        assert.equal(preTxCoinCount.toNumber() + 1, postTxCoinCount.toNumber(), "adds coin record");
    });

});
