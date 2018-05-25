import React from 'react';
import { Link } from '../../routes';
import { Form, Button, Message, Input, Grid, Image, Container } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import coinTypeToImage from '../../lib/mappings/coinTypeToImage';

import web3 from '../../lib/web3';
import getAccounts from '../../lib/getAccounts';
import getContract from '../../lib/getContract';
import contractDefinition from '../../lib/contracts/CoinCore.json';

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
        coinHelper: undefined,
    };

    static async getInitialProps(props) {
        const { coinId } = props.query;
        console.log(props.query);
        return { coinId }
    }

    async componentWillMount() {
        const accounts = await web3.eth.getAccounts();
        const coreInstance = await getContract(web3, contractDefinition);
        const coinHelper = new CoinHelper();

        this.setState({ accounts, coreInstance, coinHelper });
        this.getCoin();
    }

    async componentDidMount() {

    }
    async getCoin() {
        const { coinId } = this.props;
        const { accounts, coreInstance, coinHelper } = this.state;

        let coinData = await coreInstance.getCoin(coinId, { from: accounts[0] });
        const coinOwner = await coreInstance.ownerOf(coinId, { from: accounts[0] });

        coinData.push(coinOwner);
        coinData.push(coinId);
        console.log(coinData);
        coinData = coinHelper.formatCoinData(coinData);
        console.log(coinData);
        this.setState({ coinData });
    }

    renderCoinImage() {
        const { coinData } = this.state;
        const src = coinTypeToImage(coinData.coinType);

        return (
            <Container fluid>
                <Image src={src} size='medium' centered />
            </Container>
        )
    }

    renderCoinInfo() {
        const { coinData } = this.state;

        return (
        <Container>
            <h2>{coinData.mintingTime}</h2>
            <h4>Coin {coinData.coinId}</h4>
            <Link route={`/profile/${coinData.owner}`}>Owner</Link>
        </Container>
        )
    }

    render() {
        const { coinData } = this.state;
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        {coinData != undefined ? (
                            this.renderCoinImage()
                        ) : (
                                "Waiting for coin"
                            )}

                    </Grid.Row>
                    <Grid.Row>
                        {coinData != undefined ? (
                            this.renderCoinInfo()
                        ) : (
                                "Waiting for coin"
                            )}
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }

}

export default ShowCoin;