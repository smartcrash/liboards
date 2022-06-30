import { verify } from 'argon2';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { v4 as uuid } from 'uuid';
import { z, ZodError } from 'zod';
import { CORS_ORIGIN, SESSION_COOKIE } from '../constants';
import { PasswordReset, User } from "../entity";
import { magic } from '../lib/magic';
import { UserRepository } from '../repository';
import { PasswordResetRepository } from '../repository/PasswordResetRepository';
import { sendMail } from '../sendMail';
import { ContextType } from '../types';

@ObjectType()
class FieldError {
  @Field() field: string
  @Field() message: string
}

@InputType()
class UserInfo {
  @Field() email: string;
  @Field() name: string;
  @Field() picture: string;
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
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req }: ContextType): Promise<User> {
    const { userId } = req.session

    return userId ?
      UserRepository.findOneBy({ id: userId })
      : null
  }

  @Mutation(() => AuthenticationResponse)
  async createUser(
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: ContextType
  ): Promise<AuthenticationResponse> {
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

    if (await UserRepository.findOneBy({ username })) {
      errors.push({ field: 'username', message: 'This username already exists.' })
    }

    if (await UserRepository.findOneBy({ email })) {
      errors.push({ field: 'email', message: 'This email is already in use.' })
    }

    if (errors.length) return { errors }

    const user = new User()

    user.username = username
    user.email = email
    user.password = password

    await UserRepository.save(user)

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => AuthenticationResponse)
  async loginWithPassword(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: ContextType
  ): Promise<AuthenticationResponse> {
    const user = await UserRepository
      .createQueryBuilder()
      .where("LOWER(user.email) = LOWER(:email)", { email })
      .orWhere("LOWER(user.username) = LOWER(:username)", { username: email })
      .getOne()

    if (!user) {
      return { errors: [{ field: 'email', message: "This user does\'nt exists." }] }
    }

    if (!(await verify(user.password, password))) {
      return { errors: [{ field: 'password', message: "Incorrect password, try again." }] }
    }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => AuthenticationResponse)
  async loginWithToken(
    @Arg('token') token: string,
    @Arg('userInfo', () => UserInfo) userInfo: UserInfo,
    @Ctx() { req }: ContextType
  ): Promise<AuthenticationResponse> {
    try {
      magic.token.validate(token)

      const { email, name } = userInfo
      // TODO: Add random string to ensure uniqueness
      // TODO: Use `slugify` to normalize and remove spacial chars
      const username = name.toLowerCase().replace(/\s+/g, '')

      await UserRepository.upsert({ email, username }, ['email'])

      const user = await UserRepository.findOneBy({ email })

      req.session.userId = user.id

      return { user }
    } catch (error) {
      console.error(error);

      return {
        errors: [{
          field: 'token',
          message: "Something went terribly wrong!"
        }]
      }
    }
  }

  @Mutation(() => Boolean)
  async sendResetPasswordEmail(
    @Arg('email') email: string,
  ): Promise<Boolean> {
    const user = await UserRepository.findOneBy({ email })

    if (!user) return false

    const token = uuid()

    const pwdReset = new PasswordReset()
    pwdReset.email = user.email
    pwdReset.token = token
    await PasswordResetRepository.save(pwdReset)

    await sendMail(user.email, {
      subject: 'Reset password',
      html: `
        <p>Here is your reset password link:</p>
        <a href="${CORS_ORIGIN}/reset-password/${token}">Resert password</a>
      `
    })

    return true
  }

  @Mutation(() => AuthenticationResponse)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
  ): Promise<AuthenticationResponse> {
    // TODO: Create join to get user
    const pwdReset = await PasswordResetRepository.findOneBy({ token })

    if (!pwdReset || pwdReset.expired) return {
      errors: [{
        field: 'token',
        message: "Sorry, your token seems to have expired. Please try again."
      }]
    }

    const user = await UserRepository.findOneBy({ email: pwdReset.email })

    if (!user) return {
      errors: [{
        field: 'token',
        message: "User no longer exists."
      }]
    }

    user.password = newPassword

    await UserRepository.save(user)
    await PasswordResetRepository.delete({ token })

    return { user }
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() { req, res }: ContextType
  ): Promise<boolean> {
    await new Promise<any>((resolve) => req.session.destroy(resolve))
    res.clearCookie(SESSION_COOKIE)
    return true
  }
}
