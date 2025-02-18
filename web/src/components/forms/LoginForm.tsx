import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import Button from '../ui/Button'
import Input from '../ui/Input'
import toast from 'react-hot-toast'
import FormError from './FormError'
import axios from '../../lib/axios'

type Inputs = {
  email: string
  password: string
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    axios.post('/session', data)
      .then(() => {
        navigate({ to: '/' })
        toast.success(`Welcome back, ${data.email}!`)
      })
      .catch((err) => {
        toast.error(err.response.data.error)
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-4 w-[28rem] mb-4">
      <div className="flex flex-col gap-1">
        <Input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <FormError>{errors.email.message}</FormError>}
      </div>

      <div className="flex flex-col gap-1 mb-2">
        <Input
          type="password"
          placeholder="Password"
          {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password length must be >8' }
          })}
        />
        {errors.password && <FormError>{errors.password.message}</FormError>}
      </div>

      <Button type="submit">Log In</Button>
    </form>
  )
}
