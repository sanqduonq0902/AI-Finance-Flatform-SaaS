import { Router } from "express";
import { createTransactionController, deleteTransactionController, getAllTransactionController, getTransactionByIdController, updateTransactionController } from "../controllers/transaction.controllers";

const router = Router();

router.post('/create', createTransactionController);
router.get('/all', getAllTransactionController);
router.get('/:id', getTransactionByIdController);
router.put('/:id', updateTransactionController);
router.delete('/:id', deleteTransactionController);

export default router;