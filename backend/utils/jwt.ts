import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Env } from '../config/env.config';

type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'y';
type TimeString = `${number}${TimeUnit}`;

export type AccessTokenPayload = {
    userId: string
}

type SignOtpsAndSecret = SignOptions & {
    secret: string,
    expiresIn?: TimeString | number;
}

const defaults: SignOptions = {
    audience: ['user']
}

const accessTokenSignOptions: SignOtpsAndSecret = {
    expiresIn: Env.JWT_EXPIRES_IN as TimeString,
    secret: Env.JWT_SECRET
}

export const signJwtToken = (payload: AccessTokenPayload, options?: SignOtpsAndSecret) => {
    const isAccessToken = !options || options === accessTokenSignOptions;

    const {secret, ...otps} = options || accessTokenSignOptions;

    const token = jwt.sign(payload, secret, {
        ...defaults,
        ...otps
    });

    const expiresAt = isAccessToken 
        ? (jwt.decode(token) as JwtPayload)?.exp! * 1000
        : undefined

    return {
        token, 
        expiresAt
    }
}