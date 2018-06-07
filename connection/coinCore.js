const initContract = require('truffle-contract');
const getContract = require('../lib/getContract');
const CoinHelper = require('../lib/CoinHelper');

const coinCoreDefinition = require('../build/contracts/CoinCore.json');
const saleAuctionDefinition = require('../build/contracts/SaleClockAuction.json');
const geneScienceDefinition = require('../build/contracts/GeneScienceTest.json');


module.exports = {
    getAccounts: async function (callback) {
        var self = this;

        // Bootstrap the CoinCore abstraction for Use.
        CoinCore.setProvider(self.web3.currentProvider);

        if (typeof CoinCore.currentProvider.sendAsync !== 'function') {
            CoinCore.currentProvider.sendAsync = function () {
                return CoinCore.currentProvider.send.apply(
                    CoinCore.currentProvider, arguments
                )
            }
        }

        // Get the initial account balance so it can be displayed.
        self.web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }
            self.accounts = accs;
            self.account = self.accounts[0];

            callback(self.accounts);
        });
    },
    //Read Methods
    getCoin: async function (coinIndex, account, callback) {
        var self = this;
        let result;

        const coreInstance = await getContract(self.web3, coinCoreDefinition);
        const saleAuctionInstance = await getContract(self.web3, saleAuctionDefinition);

        try {
            let coinInfo = await coreInstance.getCoin(coinIndex, { from: account });

            const ownerId = await coreInstance.ownerOf(coinIndex, { from: account });
            const isOnAuction = await saleAuctionInstance.isOnAuction(coinIndex, { from: account });

            coinInfo.push(ownerId);
            coinInfo.push(coinIndex);

            if (isOnAuction) {
                const auctionInfo = await saleAuctionInstance.getAuction(coinIndex, { from: account });
                console.log("auction", auctionInfo);
                result = CoinHelper.formatCoinDataWithAuction(coinInfo, auctionInfo);
            } else {
                result = CoinHelper.formatCoinData(coinInfo);
            }

            callback(result.valueOf());
        }
        catch (e) {
            console.log(e);
            callback("Error 404");
        }
    },
    ownerOf: async function (coinIndex, account, callback) {
        var self = this;

        const coreInstance = await getContract(self.web3, coinCoreDefinition);

        try {
            const result = await coreInstance.ownerOf.call(coinIndex, { from: account });
            callback(result.valueOf());
        }
        catch (e) {
            console.log(e);
            callback("Error 404");
        }
    },
    getCoinsByOwner: async function (ownerAccount, account, callback) {
        var self = this;
        let result = [];

        const coreInstance = await getContract(self.web3, coinCoreDefinition);
        const saleAuctionInstance = await getContract(self.web3, saleAuctionDefinition);

        try {
            let coinList = await coreInstance.getCoinsByOwner(ownerAccount, { from: account });

            for (let coinIndex of coinList) {
                let coinInfo = await coreInstance.getCoin(coinIndex, { from: account });

                const ownerId = await coreInstance.ownerOf(coinIndex, { from: account });
                const isOnAuction = await saleAuctionInstance.isOnAuction(coinIndex, { from: account });

                coinInfo.push(ownerId);
                coinInfo.push(coinIndex);

                if (isOnAuction) {
                    const auctionInfo = await saleAuctionInstance.getAuction(coinIndex, { from: account });
                    console.log("auction", auctionInfo);
                    coinInfo = CoinHelper.formatCoinDataWithAuction(coinInfo, auctionInfo);
                } else {
                    coinInfo = CoinHelper.formatCoinData(coinInfo);
                }

                result.push(coinInfo);
            }
            
            callback(result.valueOf());
        }
        catch (e) {
            console.log(e);
            callback("Error 404");
        }
    },
    getContractAddresses: async function (account, callback) {
        var self = this;
        let result = {};

        const coreInstance = await getContract(self.web3, coinCoreDefinition);
        const saleAuctionInstance = await getContract(self.web3, saleAuctionDefinition);
        const geneScienceInstance = await getContract(self.web3, geneScienceDefinition);

        try {
            result.coreAddress = coreInstance.address;
            result.saleAuctionAddress = saleAuctionInstance.address;
            result.geneScienceAddress = geneScienceInstance.address;

            callback(result.valueOf());
        }
        catch (e) {
            console.log(e);
            callback("Error 404");
        }
    },
    getContractInstances: async function (account, callback) {
        var self = this;
        let result = {};

        const coreInstance = await getContract(self.web3, coinCoreDefinition);
        const saleAuctionInstance = await getContract(self.web3, saleAuctionDefinition);
        const geneScienceInstance = await getContract(self.web3, geneScienceDefinition);

        try {
            result.coreInstance = coreInstance;
            result.saleAuctionInstance = saleAuctionInstance;
            result.geneScienceInstance = geneScienceInstance;
            
            callback(result.valueOf());
        }
        catch (e) {
            console.log(e);
            callback("Error 404");
        }
    },
}
