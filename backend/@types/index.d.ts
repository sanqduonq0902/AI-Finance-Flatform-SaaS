import { IUser } from "../interface/user.interface";

declare global {
    namespace Express {
        export interface User extends IUser {
            _id?: any
        }
    }
}