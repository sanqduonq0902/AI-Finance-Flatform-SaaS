import { Router } from "express";
import { createTransactionController, getAllTransactionController } from "../controllers/transaction.controllers";

const router = Router();

router.post('/create', createTransactionController);
router.get('/all', getAllTransactionController);

export default router;