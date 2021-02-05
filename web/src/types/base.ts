export interface List<T> {
  code: number
  total: number
  data: T[]
}

export interface User {
  id: string
  name: string
  email: string
}
