import React from 'react';
import { Link } from '../routes';
import { Grid, Menu, Form, Button, Message, Input, Pagination, Card, Image } from 'semantic-ui-react';
import coinTypeToImage from '../lib/mappings/coinTypeToImage';
import coinGenesToEyes from '../lib/mappings/coinGenesToEyes';
import Layout from '../components/Layout';

import web3 from '../lib/web3';
import getAccounts from '.././lib/getAccounts';
import getContract from '.././lib/getContract';
import contractDefinition from '../lib/contracts/CoinCore.json';

const MARKET_TAB_STRING = 'For Sale';
const MYCOINS_TAB_STRING = 'My Coins';

class Index extends React.Component {
  state = {
    coins: [],
    coreInstance: undefined,
    accounts: undefined,
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

  async componentWillMount() {
    const accounts = await web3.eth.getAccounts();
    const coreInstance = await getContract(web3, contractDefinition);

    this.setState({ accounts, coreInstance });
    console.log("props", this.props);
    console.log("state", this.state);

    this.getCoinListByPage();
  }

  async componentDidMount() {

  }

  formatCoinData(coinData) {
    let formattedData = [];

    for (let i in coinData) {
      formattedData[i] = {
        mintingTime: coinData[i][0].toNumber(),
        generation: coinData[i][1].toNumber(),
        coinType: coinData[i][2].toNumber(),
        genes: coinData[i][3].toNumber(),
        owner: coinData[i][4],
        coinId: coinData[i][5],
      };
    }

    return formattedData;
  }

  async getCoinListByPage() {
    const { activeItem, accounts, coreInstance } = this.state;

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
      let ownerId = await coreInstance.ownerOf(coinIndicies[i], { from: accounts[0] });

      txResult.push(ownerId);
      txResult.push(coinIndicies[i]);
      console.log("ownerId", ownerId);
      console.log("txReslt", txResult);
      coinData.push(txResult);
    }
    coinData = this.formatCoinData(coinData);

    this.setState({ coinData });
    console.log("coinData", coinData);
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
      //console.log(coin.coinType, "coinType");
      return (
        <Card fluid>
          <Image src={src} size='small' centered />

          <Card.Content>
            <Card.Header>
              {coin.coinType}
            </Card.Header>
            <Card.Description>
              {coin.owner}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Link route={`/coin/${coin.coinId}`}>Coin Link</Link>
          </Card.Content>
        </Card>
      );
    });

    return items;
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
              <Card.Group itemsPerRow={3}>
                {this.renderItems()}
              </Card.Group>
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
        </Grid>
        {/* <a href='https://www.freepik.com/free-vector/cartoon-eyes_761389.htm'>Designed by Freepik</a> */}
      </Layout>
    )
  }
}

export default Index;
