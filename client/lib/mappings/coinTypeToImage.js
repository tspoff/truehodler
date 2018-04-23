const coinTypeToImage = (index) => {

    let image = '';

    switch (+index) {
        case 0: image = '1st'; break;
        case 1: image = 'amp'; break;
        case 2: image = 'ans'; break;
        case 3: image = 'ant'; break;
        case 4: image = 'ardr'; break;
        case 5: image = 'ark'; break;
        case 6: image = 'bay'; break;
        case 7: image = 'bcap'; break;
        case 8: image = 'bcn'; break;
        case 9: image = 'btc'; break;
        case 10: image = 'btcc'; break;
        case 11: image = 'btcd'; break;
        case 12: image = 'bts'; break;
        case 13: image = 'clam'; break;
        case 14: image = 'crbit'; break;
        case 15: image = 'dash'; break;
        case 16: image = 'dcr'; break;
        case 17: image = 'dgb'; break;
        case 18: image = 'dgd'; break;
        case 19: image = 'doge'; break;
        case 20: image = 'emc'; break;
        case 21: image = 'etc'; break;
        case 22: image = 'eth'; break;
        case 23: image = 'fct'; break;
        case 24: image = 'game'; break;
        case 25: image = 'gbyte'; break;
        case 26: image = 'gno'; break;
        case 27: image = 'gnt'; break;
        case 28: image = 'grc'; break;
        case 29: image = 'gup'; break;
        case 30: image = 'hmq'; break;
        case 31: image = 'icn'; break;
        case 32: image = 'ion'; break;
        case 33: image = 'iot'; break;
        case 34: image = 'kmd'; break;
        case 35: image = 'lbc'; break;
        case 36: image = 'lkk'; break;
        case 37: image = 'lsk'; break;
        case 38: image = 'ltc'; break;
        case 39: image = 'maid'; break;
        case 40: image = 'mln'; break;
        case 41: image = 'mona'; break;
        case 42: image = 'mue'; break;
        case 43: image = 'nlg'; break;
        case 44: image = 'nmc'; break;
        case 45: image = 'nvc'; break;
        case 46: image = 'nxt'; break;
        case 47: image = 'omni'; break;
        case 48: image = 'pivx'; break;
        case 49: image = 'ppc'; break;
        case 50: image = 'rby'; break;
        case 51: image = 'rep'; break;
        case 52: image = 'rlc'; break;
        case 53: image = 'round'; break;
        case 54: image = 'sbd'; break;
        case 55: image = 'sc'; break;
        case 56: image = 'sjcx'; break;
        case 57: image = 'smc'; break;
        case 58: image = 'sngls'; break;
        case 59: image = 'steem'; break;
        case 60: image = 'strat'; break;
        case 61: image = 'swt'; break;
        case 62: image = 'sys'; break;
        case 63: image = 'time'; break;
        case 64: image = 'tkn'; break;
        case 65: image = 'trst'; break;
        case 66: image = 'ubq'; break;
        case 67: image = 'usdt'; break;
        case 68: image = 'vtc'; break;
        case 69: image = 'waves'; break;
        case 70: image = 'wct'; break;
        case 71: image = 'wings'; break;
        case 72: image = 'xaur'; break;
        case 73: image = 'xcp'; break;
        case 74: image = 'xem'; break;
        case 75: image = 'xlm'; break;
        case 76: image = 'xmr'; break;
        case 77: image = 'xpm'; break;
        case 78: image = 'xrp'; break;
        case 79: image = 'xzc'; break;
        case 80: image = 'zec'; break;
        default: image = 'clam';
    }

    return `/static/coinLogos/${image}.png`;
}

export default coinTypeToImage;