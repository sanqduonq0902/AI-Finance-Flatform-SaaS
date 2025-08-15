import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { HTTP_STATUS } from "../config/http.config";
import { loginService, registerService } from "../services/auth.services";

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

export const loginController = asyncHandler(
    async(req: Request, res: Response) => {
        const body = loginSchema.parse(req.body);
        const {user, accessToken, expiresAt, reportSetting} = await loginService(body);

        return res.status(HTTP_STATUS.OK).json({
            message: 'User logged in successfully',
            user,
            accessToken,
            expiresAt,
            reportSetting
        })
    }
)
