import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import Button from '../ui/Button'
import Input from '../ui/Input'
import toast from 'react-hot-toast'
import FormError from './FormError'
import axios from '../../lib/axios'

type Inputs = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }

    axios.post('/users', data)
      .then(() => {
        navigate({ to: '/' })
        toast.success(`Welcome, @${data.username}!`)
      })
      .catch((err) => {
        toast.error(err.response.data.error)
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-4 w-[28rem] mb-4">
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          placeholder="Username"
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'Username length must be >3' },
            maxLength: { value: 40, message: 'Username length must be <40' }
          })}
        />
        {errors.username && <FormError>{errors.username.message}</FormError>}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <FormError>{errors.email.message}</FormError>}
      </div>

      <div className="flex flex-col gap-1">
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

      <div className="flex flex-col gap-1 mb-2">
        <Input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword', { required: 'Password confirmation is required' })}
        />
        {errors.confirmPassword && <FormError>{errors.confirmPassword.message}</FormError>}
      </div>

      <Button type="submit">Sign Up</Button>
    </form>
  )
}
