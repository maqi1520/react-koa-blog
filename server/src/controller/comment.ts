import { BaseContext } from 'koa'
import {
  getManager,
  Repository,
  TreeRepository,
  FindManyOptions,
  FindConditions,
} from 'typeorm'
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
import { Comment, commentSchema } from '../entity/comment'
import { ErrorException } from '../exceptions'

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
})
@tagsAll(['comment'])
@prefix('/api')
export default class CommentController {
  @request('get', '/comment')
  @summary('Find all comments')
  @query({
    articleId: { type: 'number', default: 20, description: 'articleId' },
  })
  public static async query(ctx: BaseContext): Promise<void> {
    const { articleId, pageNum = 1, pageSize = 10 } = ctx.request.query
    const repository: TreeRepository<Comment> = getManager().getTreeRepository(
      Comment
    )

    const where: FindConditions<Comment> | FindConditions<Comment>[] = {
      articleId,
      parentId: null,
    }

    const options: FindManyOptions<Comment> = {
      where,
      relations: ['children'],
      order: {
        createdAt: -1,
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    }

    const [data, total] = await repository.findAndCount(options)
    const roots = await Promise.all(
      data.map((root) => repository.findDescendantsTree(root))
    )

    ctx.status = 200
    ctx.body = { data: roots, total }
  }

  @request('post', '/comment')
  @summary('Create a comment')
  @body(commentSchema)
  public static async create(ctx: BaseContext): Promise<void> {
    const repository: Repository<Comment> = getManager().getRepository(Comment)

    const starToBeSaved = repository.create(ctx.request.body)

    const errors: ValidationError[] = await validate(starToBeSaved) // errors is an array of validation errors

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400
      ctx.body = errors
    } else {
      const comment = await repository.save(starToBeSaved)
      ctx.status = 201
      ctx.body = comment
    }
  }

  @request('put', '/comment/{id}')
  @summary('Update a comment')
  @path({
    id: { type: 'number', required: true, description: 'id of comment' },
  })
  @body(Comment)
  public static async update(ctx: BaseContext): Promise<void> {
    const repository: Repository<Comment> = getManager().getRepository(Comment)

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

  @request('delete', '/comment/{id}')
  @summary('Delete Comment by id')
  @path({
    id: { type: 'number', required: true, description: 'id of comment' },
  })
  public static async remove(ctx: BaseContext): Promise<void> {
    const repository = getManager().getRepository(Comment)

    const starToRemove: Comment | undefined = await repository.findOne(
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
