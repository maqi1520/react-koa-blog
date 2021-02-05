import { List } from './base'
import { Tag } from './tags'

export interface Article {
  published?: boolean
  categories?: Tag[]
  title: string
  readedCount: number
  id?: string
  userId?: number
  summary?: string
  createdAt?: string
  content: string
}

export type IArticleList = List<Article>
