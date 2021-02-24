import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  ManyToOne,
  TreeParent,
  Tree,
} from 'typeorm'
import { Length, IsEmail, IsUrl, ValidateIf } from 'class-validator'
import { Article } from './article'

@Entity()
@Tree('nested-set')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  @Length(6, 100)
  @IsEmail()
  email: string

  @Column({ nullable: true })
  @IsUrl()
  @ValidateIf((e) => e.url !== '')
  url: string

  @Column()
  text: string

  @TreeChildren()
  children: Comment[]

  @TreeParent()
  parent: Comment

  @Column('int', { nullable: true })
  parentId: number

  @Column('int', { nullable: true })
  articleId: number

  @ManyToOne((type) => Article, (article) => article.comment)
  article: Article

  @Column({
    nullable: false,
    type: 'timestamp',
    default:"CURRENT_TIMESTAMP",
  })
  createdAt: string

  @Column({
    nullable: false,
    type: 'timestamp',
    default: "CURRENT_TIMESTAMP",
  })
  updatedAt: string
}

export const commentSchema = {
  id: { type: 'number', required: true, example: 1 },
  name: { type: 'string', required: true, example: 'Javier' },
  text: {
    type: 'string',
    required: true,
    example: '很棒',
  },
  url: {
    type: 'string',
    example: 'http://baudi.com',
  },
  email: {
    type: 'string',
    required: true,
    example: 'avileslopez.javier@gmail.com',
  },
  articleId: {
    type: 'number',
    required: true,
    example: '2',
  },
}
