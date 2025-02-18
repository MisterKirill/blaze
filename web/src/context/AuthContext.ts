import { createContext, useContext } from 'react'

export type Auth = {
  loading: boolean
  user: {
    username: string
    display_name: string | null
    stream_name: string | null
    bio: string | null
  } | null
}

export const AuthContext = createContext<Auth>({
  loading: true,
  user: null,
})

export function useAuth() {
  return useContext(AuthContext)
}
