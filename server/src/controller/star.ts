import { BaseContext } from 'koa'
import { getManager, Repository } from 'typeorm'
import { validate, ValidationError } from 'class-validator'
import {
  request,
  summary,
  path,
  body,
  responsesAll,
  tagsAll,
  query,
  prefix,
} from 'koa-swagger-decorator'
import { Star, StarSchema } from '../entity/star'
import { ErrorException } from '../exceptions'

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
  401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['star'])
@prefix('/api')
export default class StarController {
  @request('get', '/star')
  @summary('Find all stars')
  @query({
    pageNum: { type: 'number', default: 1, description: 'pageNum' },
    pageSize: { type: 'number', default: 20, description: 'pageSize' },
  })
  public static async query(ctx: BaseContext): Promise<void> {
    const { pageSize = 20, pageNum = 1 } = ctx.request.query
    const repository: Repository<Star> = getManager().getRepository(Star)

    const [data, total] = await repository.findAndCount({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    })

    ctx.status = 200
    ctx.body = { data, total }
  }

  @request('get', '/star/{id}')
  @summary('Find star by id')
  @path({
    id: { type: 'number', required: true, description: 'id of star' },
  })
  public static async get(ctx: BaseContext): Promise<void> {
    const repository: Repository<Star> = getManager().getRepository(Star)

    const star: Star | undefined = await repository.findOne(+ctx.params.id || 0)

    if (star) {
      ctx.status = 200
      ctx.body = star
    } else {
      // return a BAD REQUEST status code and error message
      ctx.status = 400
      ctx.body = "The id you are trying to retrieve doesn't exist in the db"
    }
  }

  @request('post', '/star')
  @summary('Create a star')
  @body(StarSchema)
  public static async create(ctx: BaseContext): Promise<void> {
    const repository: Repository<Star> = getManager().getRepository(Star)

    const starToBeSaved = repository.create(ctx.request.body)

    const errors: ValidationError[] = await validate(starToBeSaved) // errors is an array of validation errors

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400
      ctx.body = errors
    } else {
      const star = await repository.save(starToBeSaved)
      ctx.status = 201
      ctx.body = star
    }
  }

  @request('put', '/star/{id}')
  @summary('Update a star')
  @path({
    id: { type: 'number', required: true, description: 'id of star' },
  })
  @body(Star)
  public static async update(ctx: BaseContext): Promise<void> {
    const repository: Repository<Star> = getManager().getRepository(Star)

    const id = +ctx.params.id || 0

    const starToBeUpdated = await repository.findOne(id)

    if (!starToBeUpdated) {
      // return a BAD REQUEST status code and error message
      throw new ErrorException(
        "The id you are trying to update doesn't exist in the db"
      )
    }
    repository.merge(starToBeUpdated, ctx.request.body)

    const errors: ValidationError[] = await validate(starToBeUpdated) // errors is an array of validation errors

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400
      ctx.body = errors
    } else {
      ctx.status = 201
      ctx.body = await repository.save(starToBeUpdated)
    }
  }

  @request('delete', '/star/{id}')
  @summary('Delete star by id')
  @path({
    id: { type: 'number', required: true, description: 'id of star' },
  })
  public static async remove(ctx: BaseContext): Promise<void> {
    const repository = getManager().getRepository(Star)

    const starToRemove: Star | undefined = await repository.findOne(
      +ctx.params.id || 0
    )
    if (!starToRemove) {
      // return a BAD REQUEST status code and error message
      ctx.status = 400
      ctx.body = "The id you are trying to delete doesn't exist in the db"
    } else {
      await repository.remove(starToRemove)
      // return a NO CONTENT status code
      ctx.status = 204
    }
  }
}
