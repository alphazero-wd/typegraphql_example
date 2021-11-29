import { Field, ID, ObjectType, Root } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  fullName(@Root() { firstName, lastName }: User): string {
    return `${firstName} ${lastName}`;
  }
  @Field()
  @Column('text', { nullable: true })
  imageUrl?: string;

  @Column()
  password!: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  isConfirmed: boolean;
}
