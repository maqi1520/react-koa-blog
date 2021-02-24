import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNotEmpty()
  name: string

  @Column({
    nullable: false,
    type: 'timestamp',
    default: "CURRENT_TIMESTAMP",
  })
  createdAt: string

  @Column({
    nullable: false,
    type: 'timestamp',
    default: "CURRENT_TIMESTAMP",
  })
  updatedAt: string
}

export const CategorySchema = {
  id: { type: 'number', example: 1 },
  name: { type: 'string', required: true, example: 'tag1' },
}
