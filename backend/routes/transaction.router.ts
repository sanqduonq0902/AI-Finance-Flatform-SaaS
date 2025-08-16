import { Router } from "express";
import { createTransactionController, getAllTransactionController, getTransactionByIdController } from "../controllers/transaction.controllers";

const router = Router();

router.post('/create', createTransactionController);
router.get('/all', getAllTransactionController);
router.get('/:id', getTransactionByIdController);

export default router;