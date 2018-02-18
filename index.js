var SHA512 = require("crypto-js/sha512");
class Block {
  constructor(data, timestamp, previousHash = null) {
    this.data = data;
    this.timestamp = timestamp;
    this.previousHash = previousHash ? previousHash : '';
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA512(JSON.stringify(this.data) + this.timestamp + this.previousHash + this.nonce).toString();
  }

  mine(difficulty = 8) {
    const seed = 'easycoin';
    let times = 1;
    while (difficulty > seed.repeat(times)) times++;
    while (this.hash.substring(0, difficulty) !== seed.repeat(times).substring(0, difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class BlockChain {
  constructor() {
    this.chain = [
      new Block({
        type: 'genesis',
        for: 'easycoin'
      }, new Date())
    ];
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

  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }

  append(newBlock) {
    if (!newBlock instanceof Block) throw new TypeError();
    newBlock.previousHash = this.getLastestBlock().hash;
    newBlock.mine(2); // set to 2 for development
    this.chain.push(newBlock);
  }
}

const block1 = new Block(
  {
    from: 'sender',
    to: 'receiver',
    amount: 50
  },
  new Date()
);

const block2 = new Block(
  {
    from: 'sender',
    to: 'receiver',
    amount: 100
  },
  new Date()
);

const chain = new BlockChain();
console.log('Mining block1...');
chain.append(block1);
console.log('Block mined');
console.log('Mining block2...');
chain.append(block2);
console.log('Block mined');

console.log('Is chain valid:', chain.isValid());
console.log(chain);
