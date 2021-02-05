import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import moment from 'moment'

@Entity()
export class Star {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNotEmpty()
  title: string

  @Column()
  url: string

  @Column({
    default: moment().format('YYYY-MM-DD HH:mm'),
  })
  createdAt: string

  @Column({
    default: moment().format('YYYY-MM-DD HH:mm'),
  })
  updatedAt: string
}

export const StarSchema = {
  title: { type: 'string', required: true, example: 'Javier' },
  url: { type: 'string', required: true, example: 'http://www/baidu.com/' },
}
