import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import LoginForm from '../components/forms/LoginForm'
import TextLink from '../components/ui/TextLink'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Log in | Blaze'
  }, [])

  return (
    <>
      <h1 className="font-bold text-4xl mb-4">Log in to Blaze</h1>
      <span className="font-medium">Log into your account and dive into the world of Blaze:</span>

      <LoginForm />

      <span>Not a member of Blaze yet? <TextLink to="/signup">Sign Up</TextLink>.</span>
    </>
  )
}
