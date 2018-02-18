var SHA512 = require("crypto-js/sha512");
class Block {
  constructor(data, timestamp, previousHash = null) {
    this.data = data;
    this.timestamp = timestamp;
    this.previousHash = previousHash ? previousHash : '';
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA512(JSON.stringify(this.data) + this.timestamp + this.previousHash).toString();
  }
}

const block = new Block(
  {
    from: 'sender',
    to: 'receiver',
    amount: 0
  },
  new Date()
);

console.log(block.hash);
