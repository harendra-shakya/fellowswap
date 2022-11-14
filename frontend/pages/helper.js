export async function getTokenName(address) {
    // it's just for testing
    if (address == 0x83ef57656cd23bc310a81d29a54b3b5feed53f82) return "WBTC";
    else if (address == 0x5ee82f03c1bc72127917c1c16be538d033bab2dc) return "WETH";
    else if (address == 0x1677c435179b1bc0cf303c9e3b61f392e8011f6e) return "DAI";
    else if (address == 0x1fd398520f6ac9d68a76b2ce58d51737d2b97bd0) return "USDC";
    else return "undefined";
}
