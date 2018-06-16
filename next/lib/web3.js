import Web3 from 'web3';

let web3;

//Defined on browser, not on Node
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    //On server, or not running metamask
    const provider = `http://localhost:7545`;
    // const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q');
    web3 = new Web3(provider);
}


export default web3;