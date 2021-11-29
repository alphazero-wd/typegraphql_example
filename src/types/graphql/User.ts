import { User } from '../../entity/User';
import { Field, InputType, ObjectType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  token?: string;
}

@ObjectType()
class FieldError {
  @Field({ nullable: true })
  field?: string;

  @Field()
  message: string;
}
