import { sign } from 'jsonwebtoken';
import { User } from '../entity/User';

export const createAccessToken = (user: User) =>
  sign({ userId: user.id }, 'access_secret', { expiresIn: '1h' });

export const createRefreshToken = (user: User) =>
  sign({ userId: user.id }, 'refresh_secret', { expiresIn: '1h' });
