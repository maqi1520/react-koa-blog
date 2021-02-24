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

export const StarSchema = {
  title: { type: 'string', required: true, example: 'Javier' },
  url: { type: 'string', required: true, example: 'http://www/baidu.com/' },
}
