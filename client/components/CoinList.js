import React, { Component } from 'react';
import { Menu, Card, Image } from 'semantic-ui-react';
import { Link } from '../routes';

import coinTypeToImage from '../lib/mappings/coinTypeToImage';
import coinGenesToEyes from '../lib/mappings/coinGenesToEyes';

/* Takes in a list of coinData to render */
class CoinList extends React.Component {
    state = {
        coins: [],
        coreInstance: undefined,
        accounts: undefined,
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
        coinHelper: undefined,

    }

    renderItems() {

        //Next: loop through and parse the getCoin results, remix shows how its returned.
        //You could also return an array for each property dnaArray[1-3] nameArray[1-3], etc

        let items = {};
        console.log(this.props);

        const { coinList } = this.props;
        const { itemsPerPage, activePage } = this.state;

        if (coinList == null) {
            return (
                <Card.Group items={items}></Card.Group>
            );
        }

        //Slice is inclusive of start, exclusive of end
        const endIndex = Math.min(coinList.length, (itemsPerPage * activePage));
        const startIndex = (activePage - 1) * itemsPerPage;

        const coinListSlice = coinList.slice(startIndex, endIndex);

        items = coinListSlice.map(coin => {

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
        return (
            <Card.Group itemsPerRow={3}>
                {this.renderItems()}
            </Card.Group>
        )
    }
}

export default CoinList;