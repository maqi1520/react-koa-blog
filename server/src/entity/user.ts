import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Length, IsEmail } from 'class-validator'
import { Article } from './article'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 80,
  })
  @Length(6, 80)
  name: string

  @Column({
    length: 100,
  })
  @Length(6, 100)
  @IsEmail()
  email: string

  @Column({
    length: 20,
    select: false,
  })
  @Length(6, 20)
  password: string

  @OneToMany((type) => Article, (article) => article.user)
  articles: Article[]
}

export const userSchema = {
  id: { type: 'number', required: true, example: 1 },
  name: { type: 'string', required: true, example: 'Javier' },
  password: {
    type: 'string',
    required: true,
    example: '123456',
  },
  email: {
    type: 'string',
    required: true,
    example: 'avileslopez.javier@gmail.com',
  },
}
