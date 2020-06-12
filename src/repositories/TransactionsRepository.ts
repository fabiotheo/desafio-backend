import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async all(): Promise<Transaction[]> {
    const findTransations = await this.find({ relations: ['category_id'] });
    return findTransations;
  }

  public async getBalance(): Promise<Balance> {
    let incomeValue = 0;
    let outcomeValue = 0;

    const transactions = await this.find();
    // eslint-disable-next-line array-callback-return,func-names
    transactions.map(function (transaction) {
      if (transaction.type === 'income') {
        incomeValue = transaction.value + incomeValue;
      } else if (transaction.type === 'outcome') {
        outcomeValue = transaction.value + outcomeValue;
      }
    });

    const total = incomeValue - outcomeValue;

    return { income: incomeValue, outcome: outcomeValue, total };
  }
}

export default TransactionsRepository;
