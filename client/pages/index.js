import React from 'react';
import Link from 'next/link';
import { Grid, Menu, Form, Button, Message, Input, Pagination, Card } from 'semantic-ui-react';
import Web3Container from '../lib/Web3Container';
import coinTypeToImage from '../lib/mappings/coinTypeToImage';
import coinGenesToEyes from '../lib/mappings/coinGenesToEyes';
import Layout from '../components/Layout';

const MARKET_TAB_STRING = 'For Sale';
const MYCOINS_TAB_STRING = 'My Coins';

class Index extends React.Component {
  state = {
    coins: [],

    activeItem: MYCOINS_TAB_STRING,
    itemResults: [],
    coinIndicies: null,
    coinData: null,
    loading: false,
    activePage: 1,
    totalPages: 1,
    itemsPerPage: 4,
    boundaryRange: 1,
    siblingRange: 1,
    showEllipsis: true,
    showFirstAndLastNav: true,
    showPreviousAndNextNav: true,
    saleAuctionAddress: undefined

  }

  async componentDidMount() {
    const { web3, accounts, coreInstance } = this.props;
    this.getCoinListByPage();
  }

  formatCoinData(coinData) {
    let formattedData = [];

    for (let i in coinData) {
      formattedData[i] = {
        mintingTime: coinData[i][0].toNumber(),
        generation: coinData[i][1].toNumber(),
        coinType: coinData[i][2].toNumber(),
        genes: coinData[i][3].toNumber()
      };
    }

    return formattedData;
  }

  async getCoinListByPage() {
    const { accounts, coreInstance } = this.props;
    const { activeItem } = this.state;

    //Get list of coins to render, based on tab
    let coinIndicies = [];
    let saleAuctionAddress;

    switch (activeItem) {
      case MARKET_TAB_STRING:
        saleAuctionAddress = await coreInstance.getSaleAuctionAddress.call({ from: accounts[0] });
        coinIndicies = await coreInstance.getCoinsByOwner(saleAuctionAddress, { from: accounts[0] });
        break;
      case MYCOINS_TAB_STRING:
        coinIndicies = await coreInstance.getCoinsByOwner(accounts[0], { from: accounts[0] });
        break;
    }

    console.log('coinIndicies', coinIndicies);
    this.setState({ coinIndicies, saleAuctionAddress });
    const totalPages = coinIndicies.length / this.state.itemsPerPage;
    this.setState({ totalPages })

    /*  Get the data from each coin individually
        Solidity can't return arrays of structs, but we could return an array for each property, with the index corresponding to coin index */

    let coinData = [];

    for (let i = 0; i < coinIndicies.length; i++) {
      let txResult = await coreInstance.getCoin(coinIndicies[i], { from: accounts[0] });
      coinData.push(txResult);
    }
    coinData = this.formatCoinData(coinData);

    this.setState({ coinData });
    console.log(coinData);
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    this.getCoinListByPage();
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage })
    console.log(this.state.activePage);
  };

  renderItems() {

    //Next: loop through and parse the getCoin results, remix shows how its returned.
    //You could also return an array for each property dnaArray[1-3] nameArray[1-3], etc

    let items = {};
    const { coinIndicies, coinData, itemsPerPage, activePage } = this.state;

    if (coinIndicies == null || coinData == null) {
      return (
        <Card.Group items={items}></Card.Group>
      );
    }

    //Slice is inclusive of start, exclusive of end
    const endIndex = Math.min(coinIndicies.length, (itemsPerPage * activePage));
    const startIndex = (activePage - 1) * itemsPerPage;

    const coinDataSlice = coinData.slice(startIndex, endIndex);

    items = coinDataSlice.map(coin => {

      const src = coinTypeToImage(coin.coinType);
      console.log(coin.coinType, "coinType");
      return {
        header: coin.name,
        description: coin.dna,
        image: src,
        fluid: true
      };
    });

    return (
      <Card.Group items={items} itemsPerRow={4}>
      </Card.Group>
    );
  }

  render() {
    const {
      activeItem,
      activePage,
      boundaryRange,
      siblingRange,
      showEllipsis,
      showFirstAndLastNav,
      showPreviousAndNextNav,
      totalPages } = this.state

    return (
      <Layout>
        <h1>TrueHodler</h1>
        <Grid>
          <Grid.Row>
            <Menu pointing secondary>
              <Menu.Item name={MYCOINS_TAB_STRING} active={activeItem === MYCOINS_TAB_STRING} onClick={this.handleItemClick} />
              <Menu.Item name={MARKET_TAB_STRING} active={activeItem === MARKET_TAB_STRING} onClick={this.handleItemClick} />
            </Menu>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              {this.renderItems()}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Pagination
                activePage={activePage}
                boundaryRange={boundaryRange}
                onPageChange={this.handlePaginationChange}
                size='mini'
                siblingRange={siblingRange}
                totalPages={totalPages}
                // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                ellipsisItem={showEllipsis ? undefined : null}
                firstItem={showFirstAndLastNav ? undefined : null}
                lastItem={showFirstAndLastNav ? undefined : null}
                prevItem={showPreviousAndNextNav ? undefined : null}
                nextItem={showPreviousAndNextNav ? undefined : null}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Button onClick={this.createRandomPromoCoin}>Create Random Coin</Button>
          </Grid.Row>

        </Grid>
        {/* <a href='https://www.freepik.com/free-vector/cartoon-eyes_761389.htm'>Designed by Freepik</a> */}
      </Layout>
    )
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
