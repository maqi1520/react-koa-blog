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
import { Category } from '../entity/category'
import { ErrorException } from '../exceptions'

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
  401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['category'])
@prefix('/api')
export default class CategoryController {
  @request('get', '/category')
  @summary('Find all categorys')
  @query({
    pageNum: { type: 'number', default: 1, description: 'pageNum' },
    pageSize: { type: 'number', default: 20, description: 'pageSize' },
  })
  public static async query(ctx: BaseContext): Promise<void> {
    const { pageSize = 20, pageNum = 1 } = ctx.request.query
    const repository: Repository<Category> = getManager().getRepository(
      Category
    )

    const [data, total] = await repository.findAndCount({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    })

    ctx.status = 200
    ctx.body = { data, total }
  }

  @request('get', '/category/{id}')
  @summary('Find category by id')
  @path({
    id: { type: 'number', required: true, description: 'id of category' },
  })
  public static async get(ctx: BaseContext): Promise<void> {
    const repository: Repository<Category> = getManager().getRepository(
      Category
    )

    const category: Category | undefined = await repository.findOne(
      +ctx.params.id || 0
    )

    if (category) {
      ctx.status = 200
      ctx.body = category
    } else {
      // return a BAD REQUEST status code and error message
      ctx.status = 400
      ctx.body = "The id you are trying to retrieve doesn't exist in the db"
    }
  }

  @request('put', '/category/{id}')
  @summary('Update a category')
  @path({
    id: { type: 'number', required: true, description: 'id of category' },
  })
  @body(Category)
  public static async update(ctx: BaseContext): Promise<void> {
    const repository: Repository<Category> = getManager().getRepository(
      Category
    )

    const id = +ctx.params.id || 0

    const toBeUpdated = await repository.findOne(id)

    if (!toBeUpdated) {
      // return a BAD REQUEST status code and error message
      throw new ErrorException(
        "The id you are trying to update doesn't exist in the db"
      )
    }
    repository.merge(toBeUpdated, ctx.request.body)

    const errors: ValidationError[] = await validate(toBeUpdated) // errors is an array of validation errors

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400
      ctx.body = errors
    } else {
      ctx.status = 201
      ctx.body = await repository.save(toBeUpdated)
    }
  }
}
