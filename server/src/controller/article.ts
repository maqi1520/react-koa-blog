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
import { Article, ArticleSchema } from '../entity/article'
import { ErrorException } from '../exceptions'

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
  401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['Article'])
@prefix('/api')
export default class ArticleController {
  @request('get', '/articles')
  @summary('Find all articles')
  @query({
    published: { type: 'boolean', description: 'published' },
    pageNum: { type: 'number', default: 1, description: 'pageNum' },
    pageSize: { type: 'number', default: 20, description: 'pageSize' },
  })
  public static async getArticles(ctx: BaseContext): Promise<void> {
    const {
      pageSize = 20,
      pageNum = 1,
      title,
      tag,
      published,
      userId,
    } = ctx.request.query
    const articleRepository: Repository<Article> = getManager().getRepository(
      Article
    )
    const sql = articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.categories', 'category')
    if (title) {
      sql.where('article.title like :title ', { title: `%${title}%` })
    }
    if (published === 'true') {
      sql.andWhere('article.published = :published ', { published: true })
    }
    if (userId) {
      sql.andWhere('article.userId = :userId ', { userId })
    }
    if (tag) {
      sql.andWhere('category.name like :tag ', { tag: `%${tag}%` })
    }

    sql
      .orderBy({
        'article.createdAt': 'DESC',
        'article.updatedAt': 'DESC',
      })
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)

    const [data, total] = await sql.getManyAndCount()

    ctx.status = 200
    ctx.body = { data, total }
  }

  @request('get', '/articles/{id}')
  @summary('Find article by id')
  @path({
    id: { type: 'number', required: true, description: 'id of article' },
  })
  public static async getArticle(ctx: BaseContext): Promise<void> {
    // get a article repository to perform operations with article
    const articleRepository: Repository<Article> = getManager().getRepository(
      Article
    )

    // load article by id
    const article: Article | undefined = await articleRepository
      .createQueryBuilder('article')
      .where({ id: +ctx.params.id || 0 })
      .addSelect('article.content')
      .leftJoinAndSelect('article.categories', 'category')
      .getOne()

    if (article) {
      article['readedCount'] = article['readedCount'] + 1
      await articleRepository.save(article)
      // return OK status code and loaded article object
      ctx.status = 200
      ctx.body = article
    } else {
      // return a BAD REQUEST status code and error message
      ctx.status = 400
      ctx.body =
        "The article you are trying to retrieve doesn't exist in the db"
    }
  }

  @request('post', '/articles')
  @summary('Create a article')
  @body(ArticleSchema)
  public static async createArticle(ctx: BaseContext): Promise<void> {
    // get a article repository to perform operations with article
    const articleRepository: Repository<Article> = getManager().getRepository(
      Article
    )

    // build up entity article to be saved
    // const currentUser: User = new User()
    // currentUser.id = ctx.state.user.id
    const articleToBeSaved = articleRepository.create({
      ...ctx.request.body,
      user: ctx.state.user,
    })

    // validate article entity
    const errors: ValidationError[] = await validate(articleToBeSaved) // errors is an array of validation errors

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400
      ctx.body = errors
    } else {
      // save the article contained in the POST body
      const article = await articleRepository.save(articleToBeSaved)
      // return CREATED status code and updated article
      ctx.status = 201
      ctx.body = article
    }
  }

  @request('put', '/articles/{id}')
  @summary('Update a article')
  @path({
    id: { type: 'number', required: true, description: 'id of article' },
  })
  @body(ArticleSchema)
  public static async updateArticle(ctx: BaseContext): Promise<void> {
    // get a article repository to perform operations with article
    const articleRepository: Repository<Article> = getManager().getRepository(
      Article
    )

    const id = +ctx.params.id || 0

    const articleToBeUpdated = await articleRepository.findOne(id)

    if (!articleToBeUpdated) {
      // check if a article with the specified id exists
      // return a BAD REQUEST status code and error message
      throw new ErrorException(
        "The article you are trying to update doesn't exist in the db"
      )
    }
    articleRepository.merge(articleToBeUpdated, ctx.request.body)

    // validate article entity
    const errors: ValidationError[] = await validate(articleToBeUpdated) // errors is an array of validation errors

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400
      ctx.body = errors
    } else {
      // save the article contained in the PUT body
      const article = await articleRepository.save(articleToBeUpdated)
      // return CREATED status code and updated article
      ctx.status = 201
      ctx.body = article
    }
  }

  @request('delete', '/articles/{id}')
  @summary('Delete article by id')
  @path({
    id: { type: 'number', required: true, description: 'id of article' },
  })
  public static async deleteArticle(ctx: BaseContext): Promise<void> {
    // get a article repository to perform operations with article
    const articleRepository = getManager().getRepository(Article)

    // find the article by specified id
    const articleToRemove:
      | Article
      | undefined = await articleRepository.findOne(+ctx.params.id || 0, {
      relations: ['user'],
    })
    if (!articleToRemove) {
      // return a BAD REQUEST status code and error message
      ctx.status = 400
      ctx.body = "The article you are trying to delete doesn't exist in the db"
    } else if (ctx.state.user.id !== articleToRemove.user.id) {
      // check user's token id and user id are the same
      // if not, return a FORBIDDEN status code and error message
      ctx.status = 403
      ctx.body = 'only be deleted by himself'
    } else {
      // the article is there so can be removed
      await articleRepository.remove(articleToRemove)
      // return a NO CONTENT status code
      ctx.status = 204
    }
  }
}
