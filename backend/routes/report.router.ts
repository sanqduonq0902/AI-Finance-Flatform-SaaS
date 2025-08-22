import { Router } from "express";
import { getAllReportsController } from "../controllers/report.controllers";

const router = Router();

router.get('/all', getAllReportsController);

export default router;