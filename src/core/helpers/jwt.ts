import * as jose from 'jose';
import crypto from 'node:crypto';

export const createJWT = async (jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
