import { useState, useEffect } from 'react'
import axios from './api'
import { AxiosRequestConfig } from 'axios'

export default function useRequest<T>(
  config: AxiosRequestConfig,
  req?: boolean
) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (req || req === undefined) {
      setLoading(true)
      axios
        .request<T>(config || {})
        .then((res) => {
          setData(res.data)
        })
        .catch((err) => {
          setError(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config), req])

  return {
    error,
    data,
    loading,
  }
}
