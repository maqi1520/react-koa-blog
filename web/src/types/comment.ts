import { List } from './base'

export interface Comment {
  id?: string
  articleId?: string
  parentId?: string
  createdAt?: string
  url: string
  email: string
  name: string
  text: string
  children?: Comment[]
}

export type CommentList = List<Comment>
