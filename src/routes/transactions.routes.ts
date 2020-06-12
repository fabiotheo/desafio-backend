import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionCustomRepository = getCustomRepository(
    TransactionsRepository,
  );

  const transactions = await transactionCustomRepository.all();
  const balance = await transactionCustomRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { type, value, title, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    type,
    value,
    title,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute({ id });

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('filename'),
  async (request, response) => {
    const { filename } = request.file;
    console.log(filename);

    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute({ filename });

    return response.json(transactions);
  },
);

export default transactionsRouter;
