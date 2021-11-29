import { User } from '../entity/User';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import { LoginInput, RegisterInput, UserResponse } from '../types/graphql/User';
import { createAccessToken, createRefreshToken } from '../utils/token';
import { sendEmail } from '../utils/sendEmail';
import { verify } from 'jsonwebtoken';
import { MyContext } from '../types/MyContext';
import { isAuth } from '../middlewares/isAuth';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Upload } from '../types/Upload';
@Resolver()
export class UserResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.payload?.userId) return;

    return User.findOne(req.payload?.userId);
  }

  @Mutation(() => User, { nullable: true })
  async confirmUser(
    @Arg('token') token: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse | undefined> {
    if (!token)
      return {
        errors: [
          {
            message: 'No token provided.',
          },
        ],
      };
    const payload = verify(token, 'refresh secret');
    req.payload = payload as any;

    const user = await User.findOne({
      where: { id: req.payload?.userId },
    });
    if (!user)
      return {
        errors: [
          {
            message: "User doesn't exist.",
          },
        ],
      };
    await User.update({ id: user.id }, { isConfirmed: true });
    return {
      user,
      token: createAccessToken(user!),
    };
  }

  @Mutation(() => UserResponse)
  async signup(
    @Arg('userInfo') { email, firstName, lastName, password }: RegisterInput
  ): Promise<UserResponse> {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
      return {
        errors: [
          {
            field: 'email',
            message: 'User already exists.',
          },
        ],
      };
    const hashedPassword = await hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();
    const html = `
      <h1>Email Confirmation</h1> 
      <p>Please click the link below to confirm your email</p>
      <a href="http://localhost:3000/user/confirm/${createRefreshToken(
        user
      )}">Confirm Email</a>
    `;

    await sendEmail(email, html);
    return { user, token: createAccessToken(user) };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('userInfo') { email, password }: LoginInput
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return {
        errors: [
          {
            field: 'email',
            message: "User doesn't exist.",
          },
        ],
      };

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword)
      return {
        errors: [
          {
            field: 'password',
            message: 'Invalid password.',
          },
        ],
      };

    if (!user.isConfirmed)
      return {
        errors: [
          {
            message: "You haven't confirmed your email account.",
          },
        ],
      };

    return {
      user,
      token: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async addProfileImage(
    @Arg('imageUrl', () => GraphQLUpload) { filename }: Upload
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      createWriteStream(__dirname + `/../../images/${filename}`)
        .on('error', () => reject(false))
        .on('finish', () => resolve(true));
    });
  }
}
