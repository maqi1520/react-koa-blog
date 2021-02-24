import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'

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

export const StarSchema = {
  title: { type: 'string', required: true, example: 'Javier' },
  url: { type: 'string', required: true, example: 'http://www/baidu.com/' },
}
