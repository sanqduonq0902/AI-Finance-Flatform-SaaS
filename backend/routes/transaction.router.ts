import { Router } from "express";
import { createTransactionController } from "../controllers/transaction.controllers";

const router = Router();

router.post('/create', createTransactionController);

export default router;