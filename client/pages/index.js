import React from 'react';
import { Grid, Menu, Form, Button, Message, Input, Pagination, Card, Image } from 'semantic-ui-react';
import Layout from '../components/Layout';
import CoinList from '../components/CoinList';

import web3 from '../lib/web3';
import getAccounts from '../lib/getAccounts';
import getContract from '../lib/getContract';
import contractDefinition from '../lib/contracts/CoinCore.json';
import saleAuctionDefinition from '../lib/contracts/SaleClockAuction.json';
import geneScienceDefinition from '../lib/contracts/GeneScienceTest.json';

import CoinHelper from '../lib/CoinCoreInterface';

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
    coinList: null,
    loading: false,
    activePage: 1,
    totalPages: 1,
    itemsPerPage: 4,
    boundaryRange: 1,
    siblingRange: 1,
    showEllipsis: true,
    showFirstAndLastNav: true,
    showPreviousAndNextNav: true,
    saleAuctionAddress: undefined,
    geneScienceInstance: undefined,
    coinHelper: undefined,

  }

  async componentWillMount() {
    const accounts = await web3.eth.getAccounts();

    const coreInstance = await getContract(web3, contractDefinition);
    const saleAuctionInstance = await getContract(web3, saleAuctionDefinition);
    const geneScienceInstance = await getContract(web3, geneScienceDefinition);

    const coinHelper = new CoinHelper();

    this.setState({ accounts, coreInstance, saleAuctionInstance, geneScienceInstance, coinHelper });
    console.log("props", this.props);
    console.log("state", this.state);

    this.getCoinListByPage();
  }

  async componentDidMount() {

  }

  async getCoinListByPage() {
    const { activeItem, accounts, coreInstance, coinHelper, saleAuctionInstance } = this.state;

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

    this.setState({ coinIndicies, saleAuctionAddress });
    const totalPages = coinIndicies.length / this.state.itemsPerPage;
    this.setState({ totalPages })

    /*  Get the data from each coin individually
        Solidity can't return arrays of structs, but we could return an array for each property, with the index corresponding to coin index */

    let coinList = [];

    for (let i = 0; i < coinIndicies.length; i++) {
      let txResult = await coreInstance.getCoin(coinIndicies[i], { from: accounts[0] });
      let ownerId = await coreInstance.ownerOf(coinIndicies[i], { from: accounts[0] });
      const isOnAuction = await saleAuctionInstance.isOnAuction(coinIndicies[i], { from: accounts[0] });

      txResult.push(ownerId);
      txResult.push(coinIndicies[i]);

      if (isOnAuction) {
        const auction = await saleAuctionInstance.getAuction(coinId, { from: accounts[0] });
        console.log("auction", auction);
        coinList.push(coinHelper.formatCoinDataWithAuction(txResult, auction));
      } else {
        coinList.push(coinHelper.formatCoinData(txResult));
      }
    }

    this.setState({ coinList });
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    this.getCoinListByPage();
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage })
    console.log(this.state.activePage);
  };

  render() {
    const {
      activeItem,
      activePage,
      boundaryRange,
      siblingRange,
      showEllipsis,
      showFirstAndLastNav,
      showPreviousAndNextNav,
      totalPages,
      coinList,
      } = this.state

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
                <CoinList coinList={coinList}></CoinList>
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
