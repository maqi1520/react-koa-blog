import axios, { AxiosResponse } from 'axios'
import { Comment } from '@/types'

const request = axios.create({
  baseURL: process.env.API_URL || '' + '/api',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Add a response interceptor
request.interceptors.response.use(
  function (response: AxiosResponse) {
    return response
  },
  function (error) {
    return Promise.reject(error.response.data)
  }
)
export default request

export const register = (data: { password: string; email: string }) => {
  return request.post('/auth/register', data).then((res) => res.data)
}

export const login = <T>(data: { password: string; email: string }) => {
  return request.post<T>('/auth/login', data).then((res) => res.data)
}

export const getUserInfo = <T>() => {
  return request.post<T>('/auth/me').then((res) => res.data)
}

export const getArticle = <T>(id: string) => {
  return request.get<T>(`/articles/${id}`).then((res) => res.data)
}

export const getArticles = <T>(params?: {
  userId?: string
  published?: boolean
  pageNum?: string
  pageSize?: string
  tag?: string
}) => {
  return request
    .get<T>('/articles', { params })
    .then((res) => res.data)
}

export const getCategorys = <T>() => {
  return request.get<T>(`/category`).then((res) => res.data)
}

export const removeArticle = (id: string) => {
  return request.delete(`/articles/${id}`).then((res) => res.data)
}

export const getComments = <T>(articleId: string) => {
  return request
    .get<T>(`/comment`, { params: { articleId } })
    .then((res) => res.data)
}

export const addComments = <T>(data: Comment) => {
  return request.post<T>(`/comment`, data).then((res) => res.data)
}
