import axios from './axios'

type User = {
  username: string
  email: string
  password: string
}

export async function createUser(user: User) {
  return axios.post('/users', user)
}
