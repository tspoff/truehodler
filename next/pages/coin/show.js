import React from 'react';
import Link from 'next/link';
import { Form, Button, Message, Input, Grid, Image, Container, Modal, Header } from 'semantic-ui-react';
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
        coinInfo: undefined,
        coinId: undefined,
        accounts: undefined,
        coreInstance: undefined,
        saleAuctionInstance: undefined,
        geneScienceInstance: undefined,
        coinHelper: undefined,
        saleForm: {
            startPrice: '0.01',
            endPrice: '0.005',
            duration: '2',
            loading: false,
            errorMessage: ''
        },
        transferForm: {
            toAddress: '',
            loading: false,
            errorMessage: ''
        },
    };

    static async getInitialProps(props) {
        const { coinId } = props.query;
        console.log(props.query);
        return { coinId }
    }

    async componentWillMount() {
        const accounts = await web3.eth.getAccounts();
        const coreInstance = await getContract(web3, coinCoreDefinition);
        const saleAuctionInstance = await getContract(web3, saleAuctionDefinition);
        const coinHelper = new CoinHelper();

        this.setState({ accounts, coreInstance, saleAuctionInstance, coinHelper });
        
        await this.getCoin();
    }

    async componentDidMount() {

    }
    async getCoin() {
        const { coinId } = this.props;
        const { accounts, coreInstance, saleAuctionInstance, coinHelper } = this.state;

        let response = await axios(`http://localhost:3000/api/coid/${coinId}`);
        const coinInfo = response.data;

        console.log(coinInfo);
        this.setState({ coinInfo });
    }

    saleFormSubmit = async (event) => {
        event.preventDefault();
        console.log("sale form");
        const { coinId } = this.props;
        const { accounts, coreInstance, saleAuctionInstance } = this.state;
        const { startPrice, endPrice, duration } = this.state.saleForm;

        let saleForm = { ...this.state.saleForm };
        saleForm.loading = true;
        saleForm.errorMessage = '';
        this.setState({ saleForm });

        try {
             await coreInstance.createSaleAuction(coinId, startPrice, endPrice, duration, { from: accounts[0] });
            console.log("auction created");
        } catch (err) {
            saleForm = { ...this.state.saleForm };
            saleForm.errorMessage = '';
            this.setState({ saleForm });
        }

        saleForm = { ...this.state.saleForm };
        saleForm.loading = false;
        this.setState({ saleForm });
    };

    transferFormSubmit = async (event) => {
        event.preventDefault();
        console.log("transfer form");
        const { coinId } = this.props;
        const { accounts, coreInstance, saleAuctionInstance } = this.state;
        const { toAddress } = this.state.transferForm;

        let transferForm = { ...this.state.transferForm };
        transferForm.loading = true;
        transferForm.errorMessage = '';
        this.setState({ transferForm });

        try {
             await coreInstance.transfer(toAddress, coinId, { from: accounts[0] });
            console.log("transfer");
        } catch (err) {
            transferForm = { ...this.state.transferForm };
            transferForm.errorMessage = '';
            this.setState({ transferForm });
        }

        transferForm = { ...this.state.transferForm };
        transferForm.loading = false;
        this.setState({ transferForm });
    };

    close = () => this.setState({ open: false });

    onBuy = async () => {
        const { accounts, coreInstance, saleAuctionInstance } = this.state;
    };

    onBreed = async () => {
        const { accounts, coreInstance, saleAuctionInstance } = this.state;
    };

    onSell = async () => {
        const { accounts, coreInstance, saleAuctionInstance } = this.state;

    };

    onGift = async () => {
        const { accounts, coreInstance, saleAuctionInstance } = this.state;
    };

    renderCoinImage() {
        const { coinInfo } = this.state;

        //TODO: Loading spanner
        if (coinInfo == undefined) {
            return (<div>Waiting for coins</div>);
        }

        const src = coinTypeToImage(coinInfo.coinType);

        return (
            <Container fluid>
                <Image src={coinInfo.imgUrl} size='medium' centered />
            </Container>
        )
    }

    renderCoinInfo() {
        const { coinInfo, accounts } = this.state;

        //TODO: Loading spanner
        if (coinInfo == undefined) {
            return (<div>Waiting for coins</div>);
        }

        return (
            <Container>
                <h2>{coinInfo.mintingTime}</h2>
                <h4>Coin {coinInfo.coinId}</h4>
               <Link href={`/profile?address=${coinInfo.owner}`} as={`/profile/${coinInfo.owner}`} prefetch>{coinInfo.owner}</Link>
                {coinInfo.auction ? null : (
                    <Container>
                        <Button color="green" onClick={this.onBuy}>Buy Now</Button>
                    </Container>
                )}
                {coinInfo.owner === accounts[0] ? null : (
                    <Container>
                        <Button onClick={this.onBreed}>Breed</Button>
                        <Button onClick={this.onGift}>Gift</Button>
                    </Container>
                )}
            </Container>
        )
    }

    renderSaleForm() {
        return (
            <Form onSubmit={this.saleFormSubmit} error={!!this.state.saleForm.errorMessage}>
                <Form.Field>
                    <label>Start Price</label>
                    <Input
                        label="eth"
                        labelPosition="right"
                        value={this.state.saleForm.startPrice}
                        onChange={event => {
                            let saleForm = { ...this.state.saleForm }
                            saleForm.startPrice = event.target.value;
                            this.setState({ saleForm }) 
                    }}/>
                </Form.Field>

                <Form.Field>
                    <label>End Price</label>
                    <Input
                        label="eth"
                        labelPosition="right" 
                        value={this.state.saleForm.endPrice}
                        onChange={event => {
                            let saleForm = { ...this.state.saleForm }
                            saleForm.endPrice = event.target.value;
                            this.setState({ saleForm })
                        }} />
                </Form.Field>

                <Form.Field>
                    <label>Duration</label>
                    <Input
                        label="days"
                        labelPosition="right"
                        value={this.state.saleForm.duration}
                        onChange={event => {
                            let saleForm = { ...this.state.saleForm }
                            saleForm.duration = event.target.value;
                            this.setState({ saleForm })
                        }} />
                </Form.Field>
                <Message error header="Error" content={this.state.saleForm.errorMessage}></Message>
                <Button primary loading={this.state.saleForm.loading}>Create</Button>
            </Form>
        )
    }

    renderTransferForm() {
        return (
            <Form onSubmit={this.transferFormSubmit} error={!!this.state.transferForm.errorMessage}>
                <Form.Field>
                    <label>Address</label>
                    <Input
                        value={this.state.transferForm.toAddress}
                        onChange={event => {
                            let transferForm = { ...this.state.transferForm }
                            transferForm.toAddress = event.target.value;
                            this.setState({ transferForm }) 
                    }}/>
                </Form.Field>
                <Message error header="Error" content={this.state.transferForm.errorMessage}></Message>
                <Button primary loading={this.state.transferForm.loading}>Create</Button>
            </Form>
        )
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        {this.renderCoinImage()}
                    </Grid.Row>
                    <Grid.Row>
                        {this.renderCoinInfo()}
                    </Grid.Row>
                    <Grid.Row>
                        {this.renderSaleForm()}
                    </Grid.Row>
                    <Grid.Row>
                        {this.renderTransferForm()}
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }

}

export default ShowCoin;