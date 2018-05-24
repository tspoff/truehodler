import React from 'react';
import Link from 'next/link';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Web3Container from '../lib/Web3Container';
import Layout from '../components/Layout';

class Index extends React.Component {
    state = {
        coinType: '',
        errorMessage: '',
        loading: false
    };

    async componentDidMount() {
        const { web3, accounts, coreInstance } = this.props;
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const { accounts, coreInstance } = this.props;
            const { coinType } = this.state;

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
            </Layout>
        );
    }

}

export default () => (
    <Web3Container
        renderLoading={() => <div>Loading Dapp Page...</div>}
        render={({ web3, accounts, coreInstance }) => (
            <Index accounts={accounts} coreInstance={coreInstance} web3={web3} />
        )}
    />
)
