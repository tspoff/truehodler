import getWeb3 from './getWeb3'
import getAccounts from './getAccounts'
import getContract from './getContract'
import contractDefinition from './contracts/CoinCore.json'

export default class CoinCoreInterface {
    constructor(web3, accounts, coreInstance) {
        this.web3 = web3;
        this.accounts = accounts;
        this.coreInstance = coreInstance;
    }

    async getCoinsByOwner (address) {
        const coins = await this.coreInstance.getCoinsByOwner(address, { from: this.accounts[0] });
        return coins;
    };

    async getEthBalance() {
        const balanceInWei = await this.web3.eth.getBalance(this.accounts[0], { from: this.accounts[0] });
        return (balanceInWei / 1e18);
    };
}
