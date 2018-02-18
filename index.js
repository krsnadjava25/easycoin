var SHA512 = require("crypto-js/sha512");

class Transaction {
  constructor(from, to, ammount, note = '') {
    this.from = from;
    this.to = to;
    this.ammount = ammount;
    this.note = note;
  }
}
class Block {
  constructor(transactions, timestamp, previousHash = null) {
    this.transactions = transactions;
    this.timestamp = timestamp;
    this.previousHash = previousHash ? previousHash : '';
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA512(JSON.stringify(this.transactions) + this.timestamp + this.previousHash + this.nonce).toString();
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
  constructor(reward = null, difficulty = null) {
    this.chain = [
      new Block([
        new Transaction(null, 'easycoin', null, 'genesis')
      ], new Date())
    ];
    this.difficulty = difficulty ? difficulty : 8;
    this.reward = reward ? reward : 100; // mining reward
    this.pendingTransactions = [];
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

  processTransactions(minerID) {
    if (this.pendingTransactions.length > 0) {
      const block = new Block(
        this.pendingTransactions,
        new Date(),
        this.getLastestBlock().hash
      );
      block.mine(this.difficulty);
      this.chain.push(block);

      this.pendingTransactions = [
        new Transaction(null, minerID, this.reward, 'Mining reward')
      ];
    }
  }

  appendTransaction(newTransaction) {
    if (!newTransaction instanceof Transaction) throw new TypeError();
    this.pendingTransactions.push(newTransaction);
  }

  getBalanceFromAddress(address) {
    let balance = 0;

    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if(transaction.from === address) balance -= transaction.ammount;
        if(transaction.to === address) balance += transaction.ammount;
      });
    });

    return balance;
  }
}

const easycoin = new BlockChain();
easycoin.appendTransaction(
  new Transaction(null, 'userA', 500, 'Top Up')
);
easycoin.appendTransaction(
  new Transaction(null, 'userB', 135, 'Top Up')
);
easycoin.processTransactions('krsna-address');
