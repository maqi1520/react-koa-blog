import { useState, useCallback } from 'react'

export default function usePage() {
  const [state, setState] = useState({ pageNum: 1, pageSize: 10 })
  const { pageSize, pageNum } = state

  const onShowSizeChange = useCallback((current, size) => {
    setState((prevState) => ({
      ...prevState,
      pageNum: 1,
      pageSize: size,
    }))
  }, [])
  const onChange = useCallback((page) => {
    setState((prevState) => ({
      ...prevState,
      pageNum: page,
    }))
  }, [])
  return { current: pageNum, pageSize, onChange, onShowSizeChange }
}
