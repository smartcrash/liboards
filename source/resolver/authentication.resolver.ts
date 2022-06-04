import { verify } from 'argon2';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { z, ZodError } from 'zod';
import { User } from "../entity";
import { TContext } from '../types';

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class AuthenticationResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]
  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class AuthenticationResolver {
  @Query(() => AuthenticationResponse)
  currentUser(@Ctx() { dataSource }: TContext): Promise<User> {
    // TODO: Return logged user
    return dataSource.getRepository(User).findOne({})
  }


  @Mutation(() => AuthenticationResponse)
  async createUser(
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req, dataSource }: TContext
  ): Promise<AuthenticationResponse> {
    const repository = dataSource.getRepository(User)
    const errors: FieldError[] = []

    try {
      await z.object({
        username: z.string().min(4, 'The username must contain at least 4 characters.'),
        email: z.string().email('Invalid email.'),
        password: z.string().min(4, 'The password must contain at least 4 characters.')
      }).parseAsync({ username, email, password })
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          errors: error.issues.map(({ path, message }) => ({
            field: path.join('.'),
            message
          }))
        }
      }
    }

    if (await repository.findOneBy({ username })) {
      errors.push({ field: 'username', message: 'This username already exists' })
    }

    if (await repository.findOneBy({ email })) {
      errors.push({ field: 'email', message: 'This email is already in use.' })
    }

    if (errors.length) return { errors }

    const user = new User()

    user.username = username
    user.email = email
    user.password = password

    await repository.save(user)

    req.session.userId = user.id

    return { user }
  }


  @Mutation(() => AuthenticationResponse)
  async loginWithEmailAndPassword(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req, dataSource }: TContext
  ): Promise<AuthenticationResponse> {
    const user = await dataSource.getRepository(User).findOneBy({ email })

    if (!user) {
      return { errors: [{ field: 'email', message: "This email does\'nt exists." }] }
    }

    if (!(await verify(user.password, password))) {
      return { errors: [{ field: 'password', message: "Incorrect password, try again." }] }
    }

    req.session.userId = user.id

    return { user }
  }
}
