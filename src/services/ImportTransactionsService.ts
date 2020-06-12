import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import uploadConfig from '../config/upload';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const createTransacttionService = new CreateTransactionService();
    const filePath = path.join(uploadConfig.directory, filename);
    const csvJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);

    const transactions: Transaction[] = [];
    csvJson.map(async item => {
      const { title, type, value, category } = item;

      const transaction = await createTransacttionService.execute({
        title,
        type,
        value: Number.parseFloat(value),
        category,
      });
      // @ts-ignore
      transactions.push(transaction);
    });
    return transactions;
  }
}

export default ImportTransactionsService;
