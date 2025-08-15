import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controllers";


const router = Router();

router.get('/current-user', getCurrentUserController);

export default router;