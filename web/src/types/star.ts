import { List } from './base'
export interface Star {
  title: string
  id: number
  url: string
  createdAt: string
}

export type IStarList = List<Star>
