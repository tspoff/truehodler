import React from 'react';
import { Link } from '../../routes';
import { Form, Button, Message, Input, Grid, Image, Container } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import CoinList from '../../components/CoinList';

import web3 from '../../lib/web3';
import getAccounts from '../../lib/getAccounts';
import getContract from '../../lib/getContract';
import contractDefinition from '../../lib/contracts/CoinCore.json';
import geneScienceDefinition from '../../lib/contracts/GeneScienceTest.json';
import saleAuctionDefinition from '../../lib/contracts/SaleClockAuction.json';

import CoinHelper from '../../lib/CoinCoreInterface';

class ShowProfile extends React.Component {
    state = {
        coinType: '',
        errorMessage: '',
        loading: false,
        coinData: undefined,
        coinId: undefined,
        accounts: undefined,
        coreInstance: undefined,
        saleAuctionInstance: undefined,
        coinList: [],
        coinHelper: undefined,
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        console.log(props.query);
        return { address }
    }

    async componentWillMount() {
        const accounts = await web3.eth.getAccounts();
        const coreInstance = await getContract(web3, contractDefinition);
        const saleAuctionInstance = await getContract(web3, saleAuctionDefinition);
        const coinHelper = new CoinHelper();

        this.setState({ accounts, coreInstance, saleAuctionInstance, coinHelper });
        await this.getCoinsByAddress(this.props.address);
    }

    async getCoinsByAddress(address) {
        const { accounts, coreInstance, coinHelper, saleAuctionInstance } = this.state;

        let coinIndicies = [];
        let coinList = [];

        coinIndicies = await coreInstance.getCoinsByOwner(address, { from: accounts[0] });

        for (let i = 0; i < coinIndicies.length; i++) {
            let txResult = await coreInstance.getCoin(coinIndicies[i], { from: accounts[0] });
            let ownerId = await coreInstance.ownerOf(coinIndicies[i], { from: accounts[0] });
            const isOnAuction = await saleAuctionInstance.isOnAuction(coinIndicies[i], { from: accounts[0] });

            txResult.push(ownerId);
            txResult.push(coinIndicies[i]);

            if (isOnAuction) {
                const auction = await saleAuctionInstance.getAuction(coinId, { from: accounts[0] });
                coinList.push(coinHelper.formatCoinDataWithAuction(txResult, auction));
            } else {
                coinList.push(coinHelper.formatCoinData(txResult));
            }
        }

        this.setState({ coinList });
    }

    render() {
        const { coinData, coinList } = this.state;
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Container>
                            <h1>{this.props.address}</h1>
                            <h3>Coins Owned: {coinList.length}</h3>
                        </Container>
                    </Grid.Row>
                    <Grid.Row>
                        <CoinList coinList={coinList}></CoinList>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }

}

export default ShowProfile;