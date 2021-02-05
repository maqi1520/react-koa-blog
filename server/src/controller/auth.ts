import { BaseContext } from 'koa'
//import * as argon2 from 'argon2';
import { getManager, Repository } from 'typeorm'
import jwt from 'jsonwebtoken'
import { request, summary, body, tagsAll, prefix } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'

import { config } from '../config'
import { UnauthorizedException, ErrorException } from '../exceptions'
import { validate, ValidationError } from 'class-validator'

@tagsAll(['Auth'])
@prefix('/api')
export default class AuthController {
  @request('post', '/auth/login')
  @summary('login')
  @body({ ...userSchema, id: undefined, name: undefined })
  public static async login(ctx: BaseContext) {
    const userRepository = getManager().getRepository(User)

    const user = await userRepository
      .createQueryBuilder()
      .where({ email: ctx.request.body.email })
      .addSelect('User.password')
      .getOne()

    if (!user) {
      throw new ErrorException('邮箱未注册')
      //} else if (await argon2.verify(user.password, ctx.request.body.password)) {
    } else if (user.password === String(ctx.request.body.password)) {
      const token = jwt.sign({ id: user.id }, config.jwtSecret)
      ctx.status = 200
      ctx.cookies.set('token', token, {
        httpOnly: true,
      })
      ctx.body = { token }
    } else {
      throw new ErrorException('密码错误')
    }
  }

  @request('post', '/auth/register')
  @summary('register')
  @body({ ...userSchema, id: undefined })
  public static async register(ctx: BaseContext) {
    const userRepository = getManager().getRepository(User)

    const user = await userRepository
      .createQueryBuilder()
      .where({ email: ctx.request.body.email })
      .getOne()

    if (user) {
      throw new ErrorException('该邮箱已经注册')
    }

    const newUser = userRepository.create(ctx.request.body)

    // validate user entity
    const errors: ValidationError[] = await validate(newUser)
    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400
      ctx.body = errors
    } else {
      // 保存到数据库
      const user = await userRepository.save(newUser)
      ctx.status = 201
      ctx.body = { ...user, password: undefined }
    }
  }

  @request('post', '/auth/me')
  @summary('get current user Info')
  public static async me(ctx: BaseContext) {
    if (ctx.state.user && ctx.state.user.id) {
      const userRepository: Repository<User> = getManager().getRepository(User)

      // load user by id
      const user: User | undefined = await userRepository.findOne(
        +ctx.state.user.id || 0
      )

      // return OK status code and loaded user object
      ctx.status = 200
      ctx.body = user
    } else {
      throw new UnauthorizedException('请登录')
    }
  }
}
