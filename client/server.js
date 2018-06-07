const express = require('express');
const { parse } = require('url');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
var Web3 = require('web3');
const truffle_connect = require('../connection/coinCore.js');

const getAccount = async (web3) => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

app.prepare().then(() => {
  const server = express();

  // CUSTOM ROUTES GO HERE
  server.get('/coin/:coinId', (req, res) => {
    const mergedQuery = Object.assign({}, req.query, req.params);
    return app.render(req, res, '/coin/show', mergedQuery);
  });

  server.get('/profile/:address', (req, res) => {
    const mergedQuery = Object.assign({}, req.query, req.params);
    return app.render(req, res, '/profile/show', mergedQuery);
  });

  //API Routes
  server.get('/api/accounts', (req, res) => {
    const mergedQuery = Object.assign({}, req.query, req.params);
    console.log("**** GET /getAccounts ****");
    truffle_connect.getAccounts(answer => {
      res.send(answer);
      console.log(answer);
    })
  });

  server.get('/api/coin/:coinId', async (req, res) => {
    console.log("**** GET /getCoin ****");

    const account = "0x1b304b2fBc2838A1663357E63E3d70Dc66338d6a";
    const coinIndex = req.params.coinId;

    truffle_connect.getCoin(coinIndex, account, answer => {
      res.send(answer);
      console.log(answer);
    })
  });

  server.get('/api/profile/:address/coins', (req, res) => {
    console.log("**** GET /getCoinsByOwner ****");

    const account = "0x1b304b2fBc2838A1663357E63E3d70Dc66338d6a";
    const address = req.params.address;

    truffle_connect.getCoinsByOwner(address, account, answer => {
      res.send(answer);
      console.log(answer);
    })

  });

  server.get('/api/contractaddresses', (req, res) => {
    console.log("**** GET /getCoinsByOwner ****");

    const account = "0x1b304b2fBc2838A1663357E63E3d70Dc66338d6a";

    truffle_connect.getContractAddresses(account, answer => {
      res.send(answer);
      console.log(answer);
    })

  });

  server.get('/api/contractinstances', (req, res) => {
    console.log("**** GET /getCoinsByOwner ****");

    const account = "0x1b304b2fBc2838A1663357E63E3d70Dc66338d6a";

    truffle_connect.getContractInstances(account, answer => {
      res.send(answer);
      console.log(answer);
    })

  });

  // THIS IS THE DEFAULT ROUTE, DON'T EDIT THIS 
  server.get('*', (req, res) => {
    return handle(req, res);
  });
  const port = process.env.PORT || 3000;

  server.listen(port, err => {
    if (err) throw err;

    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      // Use Mist/MetaMask's provider
      truffle_connect.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    console.log("Express Listening at http://localhost:" + port);

    console.log(`> Ready on port ${port}...`);
  });
});