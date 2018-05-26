import React from 'react';
import { Link } from '../../routes';
import { Form, Button, Message, Input, Grid, Image, Container } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import coinTypeToImage from '../../lib/mappings/coinTypeToImage';

import web3 from '../../lib/web3';
import getAccounts from '../../lib/getAccounts';
import getContract from '../../lib/getContract';
import coinCoreDefinition from '../../lib/contracts/CoinCore.json';
import geneScienceDefinition from '../../lib/contracts/GeneScienceTest.json';
import saleAuctionDefinition from '../../lib/contracts/SaleClockAuction.json';

import CoinHelper from '../../lib/CoinCoreInterface';

class ShowCoin extends React.Component {
    state = {
        coinType: '',
        errorMessage: '',
        loading: false,
        coinData: undefined,
        coinId: undefined,
        accounts: undefined,
        coreInstance: undefined,
        saleAuctionInstance: undefined,
        geneScienceInstance: undefined,
        coinHelper: undefined,
    };

    static async getInitialProps(props) {
        const { coinId } = props.query;
        console.log(props.query);
        return { coinId }
    }

    async componentWillMount() {
        const accounts = await web3.eth.getAccounts();
        const coreInstance = await getContract(web3, coinCoreDefinition);
        // const geneScienceInstance = await getContract(web3, geneScienceDefinition);
        const saleAuctionInstance = await getContract(web3, saleAuctionDefinition);
        const coinHelper = new CoinHelper();

        this.setState({ accounts, coreInstance, saleAuctionInstance, coinHelper });
        this.getCoin();
    }

    async componentDidMount() {

    }
    async getCoin() {
        const { coinId } = this.props;
        const { accounts, coreInstance, saleAuctionInstance, coinHelper } = this.state;

        let coinData = await coreInstance.getCoin(coinId, { from: accounts[0] });
        const coinOwner = await coreInstance.ownerOf(coinId, { from: accounts[0] });
        const isOnAuction = await saleAuctionInstance.isOnAuction(coinId, { from: accounts[0] });

        coinData.push(coinOwner);
        coinData.push(coinId);

        if (isOnAuction) {
            const auction = await saleAuctionInstance.getAuction(coinId, { from: accounts[0] });
            coinData.push(auction);
        }

        console.log(coinData);
        coinData = coinHelper.formatCoinData(coinData);
        console.log(coinData);
        this.setState({ coinData });
    }

    renderCoinImage() {
        const { coinData } = this.state;

        //TODO: Loading spanner
        if (coinData == undefined) {
            return (<div>Waiting for coins</div>);
        }

        const src = coinTypeToImage(coinData.coinType);

        return (
            <Container fluid>
                <Image src={src} size='medium' centered />
            </Container>
        )
    }

    renderCoinInfo() {
        const { coinData } = this.state;

        //TODO: Loading spanner
        if (coinData == undefined) {
            return (<div>Waiting for coins</div>);
        }

        return (
            <Container>
                <h2>{coinData.mintingTime}</h2>
                <h4>Coin {coinData.coinId}</h4>
                <Link route={`/profile/${coinData.owner}`}>Owner</Link>
                {coinData ? null : (
                    <Button color="green" onClick={this.onBuy}>Buy Now</Button>
                )}
            </Container>
        )
    }

    onBuy = async () => {
        const { accounts, coreInstance } = this.props;

    };

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        { this.renderCoinImage() }
                    </Grid.Row>
                    <Grid.Row>
                        { this.renderCoinInfo() }
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }

}

export default ShowCoin;