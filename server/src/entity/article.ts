import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { User } from './user'
import { Comment } from './comment'
import { Category, CategorySchema } from './category'

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNotEmpty()
  title: string

  @Column({
    nullable: true,
  })
  summary: string

  @Column({
    select: false,
    type: 'text',
  })
  content: string

  @Column({
    default: 1,
  })
  readedCount: number

  @Column({
    default: false,
  })
  published: boolean

  @ManyToMany((type) => Category, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[]

  @ManyToOne((type) => User, (user) => user.articles)
  user: User

  @OneToMany((type) => Comment, (comment) => comment.article)
  comment: Comment

  @Column('int', { nullable: true })
  userId: number

  @Column({
    nullable: false,
    type: 'timestamp',
    default:()=>"CURRENT_TIMESTAMP"
  })
  createdAt: Date

  @Column({
    nullable: true,
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}

export const ArticleSchema = {
  title: { type: 'string', required: true, example: 'Javier' },
  content: {
    type: 'string',
    required: true,
    example: '## content \n ### title3',
  },
  categories: {
    type: 'array',
    items: {
      type: 'object',
      properties: CategorySchema,
    },
  },
}
