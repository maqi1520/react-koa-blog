import axios from 'axios'

//========== node 接口 ====

export const getArticles = <T>(params?: {
  published?: boolean
  pageNum?: string
  pageSize?: string
  tag?: string
}) => {
  return axios
    .get<T>(process.env.API_URL + '/api/articles', { params })
    .then((res) => res.data)
}

export const getCategorys = <T>(params?: {
  pageNum?: string
  pageSize?: string
}) => {
  return axios
    .get<T>(process.env.API_URL + '/api/category', { params })
    .then((res) => res.data)
}

export const getStars = <T>(params?: {
  pageNum?: string
  pageSize?: string
}) => {
  return axios
    .get<T>(process.env.API_URL + '/api/star', { params })
    .then((res) => res.data)
}

export const getArticle = <T>(id: string) => {
  return axios
    .get<T>(process.env.API_URL + `/api/articles/${id}`)
    .then((res) => res.data)
}

export const getUser = <T>(token: string) => {
  return axios
    .post<T>(process.env.API_URL + `/api/auth/me`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

export const getUserById = <T>(id: string) => {
  return axios
    .get<T>(process.env.API_URL + `/api/users/${id}`)
    .then((res) => res.data)
}
