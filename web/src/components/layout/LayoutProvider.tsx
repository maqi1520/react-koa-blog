import { getUserInfo } from '@/common/api'
import { User } from '@/types/base'
import React, {
  createContext,
  ReactElement,
  useMemo,
  useState,
  useEffect,
} from 'react'

interface Props {
  children: ReactElement
}

interface Action {
  getUser: () => void
}
interface State {
  user: User | null
  loading: boolean
}
export type IContext = [State, Action]

export const Context = createContext<IContext | null>(null)

export default function LayoutProvider({ children }: Props): ReactElement {
  const [state, setstate] = useState<State>({
    user: null,
    loading: true,
  })

  const action = useMemo(
    () => ({
      getUser: () => {
        if (window.sessionStorage.getItem('token')) {
          getUserInfo<User>()
            .then((res) => {
              setstate({ user: res, loading: false })
            })
            .catch(() => {})
        } else {
          setstate({ user: null, loading: false })
        }
      },
    }),
    []
  )
  useEffect(() => {
    action.getUser()
  }, [action])
  return <Context.Provider value={[state, action]}>{children}</Context.Provider>
}
