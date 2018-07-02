import React from 'react';
import Link from 'next/link';
import { Form, Button, Message, Input, Grid, Image, Container } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import CoinList from '../../components/CoinList';

import web3 from '../../lib/web3';
import getContract from '../../lib/getContract';
import contractDefinition from '../../lib/contracts/CoinCore.json';
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
        const { address } = this.props;
        let response = await axios(`http://localhost:3000/api/profile/${address}/coins`);
        this.setState({ coinList: response.data });
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