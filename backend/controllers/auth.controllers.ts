import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { registerSchema } from "../validations/auth.validation";
import { HTTP_STATUS } from "../config/http.config";
import { registerService } from "../services/auth.services";

export const registerController = asyncHandler(
	async (req: Request, res: Response) => {
		const body = registerSchema.parse(req.body);
		const data = await registerService(body);

		return res.status(HTTP_STATUS.CREATED).json({
			message: "User registered successfully",
			data: data,
		});
	}
);
