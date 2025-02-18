import { ReactNode, useEffect, useState } from 'react'
import { Auth, AuthContext } from './AuthContext'
import axios from '../lib/axios'
import toast from 'react-hot-toast'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth>({
    loading: true,
    user: null,
  })

  useEffect(() => {
    axios.get('/users/me')
      .then((res) => {
        setAuth({
          loading: false,
          user: res.data,
        })
      })
      .catch((err) => {
        console.log(err)
        toast.error('Failed to get user info')
      })
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
