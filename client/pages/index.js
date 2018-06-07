import React from 'react';
import axios from 'axios';
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
    activeItem: MYCOINS_TAB_STRING,
    coinList: [],
    loading: false,
    activePage: 1,
    totalPages: 1,
    itemsPerPage: 4,
    boundaryRange: 1,
    siblingRange: 1,
    showEllipsis: true,
    showFirstAndLastNav: true,
    showPreviousAndNextNav: true,
  }

  static async getInitialProps() {
    console.log(web3);
    const accounts = await web3.eth.getAccounts();
    let response = await axios(`http://localhost:3000/api/profile/${accounts[0]}/coins`);
    const coinList = response.data;
    
    //TODO: these need to be confirmed locally, or gotten locally entirely - probably the latter.
    response = await axios(`http://localhost:3000/api/contractaddresses`);
    const contractAddresses = response.data;

    console.log(coinList);

    return {
      accounts,
      coinList,
      contractAddresses,
    };
  }

  async componentWillMount() {
    console.log("componentWillMount");  
  }

  async componentDidMount() {
    console.log("componentDidMount");
    
  }

  async getCoinListByPage() {
    const { activeItem } = this.state;
    const { accounts, contractAddresses } = this.props;

    console.log(this.props, "props");

    //Get list of coins to render, based on tab
    let coinList = [];
    let response;

    switch (activeItem) {
      case MARKET_TAB_STRING:
        console.log(contractAddresses.saleAuctionAddress, "saleAuctionAddress");
        response = await axios(`http://localhost:3000/api/profile/${contractAddresses.saleAuctionAddress}/coins`);
        coinList = response.data;
        break;

      case MYCOINS_TAB_STRING:
        response = await axios(`http://localhost:3000/api/profile/${accounts[0]}/coins`);
        coinList = response.data;
        break;
    }

    console.log(coinList, "coinList on data");
    const totalPages = coinList.length / this.state.itemsPerPage;
    this.setState({ totalPages })
    this.setState({ coinList });
  }

  handleItemClick = async (e, { name }) => {
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

    console.log(coinList, "coinList on render");

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
