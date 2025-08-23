import { Router } from "express";
import { getAllReportsController, updateReportSettingController } from "../controllers/report.controllers";

const router = Router();

router.get('/all', getAllReportsController);
router.put('/update-setting', updateReportSettingController);

export default router;