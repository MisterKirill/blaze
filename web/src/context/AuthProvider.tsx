import { ReactNode, useEffect, useState } from 'react'
import { Auth, AuthContext } from './AuthContext'
import axios from '../lib/axios'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth>({
    loading: true,
    user: null,
  })

  useEffect(() => {
    axios.get('/me')
      .then((res) => {
        setAuth({
          loading: false,
          user: res.data,
        })
      })
      .catch(() => {
        setAuth({ loading: false, user: null })
      })
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
