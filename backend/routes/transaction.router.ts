import { Router } from "express";
import {
    bulkDeleteTransactionController,
	bulkTransactionController,
	createTransactionController,
	deleteTransactionController,
	getAllTransactionController,
	getTransactionByIdController,
	scanReceiptController,
	updateTransactionController,
} from "../controllers/transaction.controllers";
import { upload } from "../config/cloudinary.config";

const router = Router();

router.post("/create", createTransactionController);
router.post("/bulk-transaction", bulkTransactionController);
router.post('/scan-receipt', upload.single('receipt'), scanReceiptController);
router.delete("/bulk-delete", bulkDeleteTransactionController);
router.get("/all", getAllTransactionController);
router.get("/:id", getTransactionByIdController);
router.put("/:id", updateTransactionController);
router.delete("/:id", deleteTransactionController);

export default router;
