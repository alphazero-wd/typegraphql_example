import { verify } from 'jsonwebtoken';
import { MyContext } from 'src/types/MyContext';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    throw new Error('You are not authorized.');
  }
  const token = authHeaders.split(' ')[1];

  if (token) {
    const payload = verify(token, 'access_secret');
    req.payload = payload as any;
  }
  return next();
};
