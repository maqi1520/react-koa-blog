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

export const CategorySchema = {
  id: { type: 'number', example: 1 },
  name: { type: 'string', required: true, example: 'tag1' },
}
