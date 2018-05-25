import React from 'react';
import { Link } from '../../routes';
import { Form, Button, Message, Input, Grid, Image } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import coinTypeToImage from '../../lib/mappings/coinTypeToImage';

import web3 from '../lib/web3';
import getAccounts from '.././lib/getAccounts';
import getContract from '.././lib/getContract';
import contractDefinition from '../lib/contracts/CoinCore.json';
import initContract from 'truffle-contract'

class ShowCoin extends React.Component {
    state = {
        coinType: '',
        errorMessage: '',
        loading: false,
        coinData: undefined,
        coinId: undefined,
        accounts: undefined,
        coreInstance: undefined,
    };

    static async getInitialProps(props) {
        const { coinId } = props.query;
        console.log(props.query);
        return { coinId }
    }

    async componentWillMount() {
        const accounts = await web3.eth.getAccounts();
        const coreInstance = await getContract(web3, contractDefinition);

        this.setState({ accounts, coreInstance });
        this.getCoin();
    }

    async componentDidMount() {

    }
    async getCoin() {
        const { accounts, coreInstance } = this.state;
        
        let coinData = await coreInstance.getCoin(coinId, { from: accounts[0] });
        const coinOwner = await coreInstance.ownerOf(coinId, { from: accounts[0] });
        console.log(coinData);
        coinData = this.formatCoinData(coinData);
        console.log(coinData);
        this.setState({coinData});
    }

    formatCoinData(coinData) {
            formattedData = {
                mintingTime: coinData[i][0].toNumber(),
                generation: coinData[i][1].toNumber(),
                coinType: coinData[i][2].toNumber(),
                genes: coinData[i][3].toNumber(),
                owner: coinData[i][4]
            };

        return formattedData;
    }

    renderCoinImage() {
        const { coinData } = this.state;
        const src = coinTypeToImage(coinData.coinType);

        return (
            <Image src={src} size='large' centered />
        )
    }

    renderCoinInfo() {
        const { coinData } = this.state;

        <div>
            <h2>{coinData.mintingTime}</h2>
            <h4>Coin {coinData.coinId}</h4>
            <Link route={`/profile/${coinData.owner}`}>Owner {coinData.owner}</Link>
        </div>
    }

    render() {
        const {coinData} = this.state;
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