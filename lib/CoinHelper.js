module.exports = { 
    formatCoinData: (coinData) => {
        return {
            mintingTime: coinData[0].toNumber(),
            generation: coinData[1].toNumber(),
            coinType: coinData[2].toNumber(),
            genes: coinData[3].toNumber(),
            owner: coinData[4],
            coinId: coinData[5].toNumber(),
        };
    },

    formatCoinDataWithAuction: (coinData, auctionData) => {
        return {
            mintingTime: coinData[0].toNumber(),
            generation: coinData[1].toNumber(),
            coinType: coinData[2].toNumber(),
            genes: coinData[3].toNumber(),
            owner: coinData[4],
            coinId: coinData[5].toNumber(),
            auction: auctionData,
        };
    },
}
