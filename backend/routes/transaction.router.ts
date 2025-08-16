import { Router } from "express";
import {
    bulkDeleteTransactionController,
	bulkTransactionController,
	createTransactionController,
	deleteTransactionController,
	getAllTransactionController,
	getTransactionByIdController,
	updateTransactionController,
} from "../controllers/transaction.controllers";

const router = Router();

router.post("/create", createTransactionController);
router.post("/bulk-transaction", bulkTransactionController);
router.delete("/bulk-delete", bulkDeleteTransactionController);
router.get("/all", getAllTransactionController);
router.get("/:id", getTransactionByIdController);
router.put("/:id", updateTransactionController);
router.delete("/:id", deleteTransactionController);

export default router;
