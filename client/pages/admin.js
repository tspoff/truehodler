import React from 'react';
import Link from 'next/link';
import { Form, Button, Message, Input, Container } from 'semantic-ui-react';
import Layout from '../components/Layout';

import web3 from '../lib/web3';
import getAccounts from '.././lib/getAccounts';
import getContract from '.././lib/getContract';
import contractDefinition from '../lib/contracts/CoinCore.json';
import initContract from 'truffle-contract'

class Admin extends React.Component {
    state = {
        coinType: '',
        errorMessage: '',
        loading: false,
        accounts: undefined,
        coreInstance: undefined,
    };

    async componentWillMount() {
        const accounts = await web3.eth.getAccounts();
        const coreInstance = await getContract(web3, contractDefinition);

        this.setState({ accounts, coreInstance });
    }

    //TODO: very temporary way to do this. can we do this on deploy?
    setInitialContractParams = async () => {
        const { accounts, coreInstance, saleAuctionInstance, geneScienceInstance, coinHelper } = this.state;

        console.log("saleAuctionInstance", saleAuctionInstance);
        //TODO: very temporary hack to set this address. can we do this on deploy?
        await coreInstance.setSaleAuctionAddress(saleAuctionInstance.address, { from: accounts[0] });

        await coreInstance.setCEO(accounts[0], { from: accounts[0] });
        await coreInstance.setCFO(accounts[0], { from: accounts[0] });
        await coreInstance.setCOO(accounts[0], { from: accounts[0] });

        await coreInstance.setGeneScienceAddress(geneScienceInstance.address, { from: accounts[0] });
        await coreInstance.setSaleAuctionAddress(saleAuctionInstance.address, { from: accounts[0] });

        await coreInstance.unpause({ from: accounts[0] });
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const { accounts, coreInstance, coinType } = this.state;

            const cooAddress = await coreInstance.getCOO.call({ from: accounts[0] });
            await coreInstance.createPromoCoin(0, coinType, cooAddress, { from: accounts[0] });

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>Create a Promotional Coin</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Coin Type</label>
                        <Input
                            value={this.state.coinType}
                            onChange={event => this.setState({ coinType: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header="Error" content={this.state.errorMessage}></Message>
                    <Button primary loading={this.state.loading}>Create!</Button>
                </Form>
                <Container>
                    <Button color="blue" onClick={this.setInitialContractParams}>Temp: Set Contract Params</Button>
                </Container>
            </Layout>
        );
    }

}

export default Admin;