import { List } from './base'

export interface Tag {
  name: string
  id?: number
  createdAt?: string
}
export type TagList = List<Tag>
