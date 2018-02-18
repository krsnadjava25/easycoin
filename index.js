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

class BlockChain {
  constructor(chain = []) {
    this.chain = chain;
  }

  isValid() {
    for (let i = 1; this.chain.length > 1 && i < this.chain.length; i++) {
      const currBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currBlock.hash !== currBlock.calculateHash()) return false;
      if (currBlock.previousHash !== prevBlock.hash) return false;
    }
    return true;
  }
}

const genBlock = new Block({}, new Date());

const block = new Block(
  {
    from: 'sender',
    to: 'receiver',
    amount: 0
  },
  new Date(),
  genBlock.hash
);

const chain = new BlockChain([
  genBlock,
  block
]);

console.log(chain.isValid());
