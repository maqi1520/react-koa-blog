import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import moment from 'moment'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNotEmpty()
  name: string

  @Column({
    default: moment().format('YYYY-MM-DD HH:mm'),
  })
  createdAt: string

  @Column({
    default: moment().format('YYYY-MM-DD HH:mm'),
  })
  updatedAt: string
}

export const CategorySchema = {
  id: { type: 'number', example: 1 },
  name: { type: 'string', required: true, example: 'tag1' },
}
