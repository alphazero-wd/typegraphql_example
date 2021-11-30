import { Connection } from 'typeorm';
import { name, internet } from 'faker';
import { graphqlCall } from '../test-utils/graphqlCall';
import { testConnection } from '../test-utils/testConn';
import { User } from '../entity/User';
import { createAccessToken } from '../utils/token';

let connection: Connection;
beforeAll(async () => {
  connection = await testConnection();
});

afterAll(async () => {
  await connection.close();
});

const signupMutation = `
  mutation($userInfo: RegisterInput!) {
    signup(userInfo: $userInfo) {
      user {
        id
        email
        fullName
        isConfirmed
      }
      token
    }
  }
`;

const meQuery = `
    {
      me {
        id
        email
        fullName
        isConfirmed
      }
    }
`;

describe('User', () => {
  it('signup', async () => {
    const user = {
      firstName: name.firstName(),
      lastName: name.lastName(),
      email: internet.email(),
      password: internet.password(),
    };

    const response = await graphqlCall({
      source: signupMutation,
      variableValues: {
        userInfo: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        signup: {
          user: {
            id: '1',
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            isConfirmed: false,
          },
        },
      },
    });
    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.isConfirmed).toBeFalsy();
  });

  it('me', async () => {
    const user = await User.create({
      firstName: name.firstName(),
      lastName: name.lastName(),
      email: internet.email(),
      password: internet.password(),
    }).save();

    const response = await graphqlCall({
      source: meQuery,
      userId: user.id,
      token: createAccessToken(user),
    });
    expect(response).toMatchObject({
      data: {
        me: {
          id: user.id.toString(),
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          isConfirmed: user.isConfirmed,
        },
      },
    });
  });
});
