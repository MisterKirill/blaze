import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import TextLink from '../components/ui/TextLink'
import SignupForm from '../components/forms/SignupForm'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Sign up | Blaze'
  }, [])

  return (
    <>
      <h1 className="font-bold text-4xl mb-4">Sign up to Blaze</h1>
      <span className="font-medium">Create a new account and dive into the world of Blaze:</span>

      <SignupForm />

      <span>Already a member of Blaze? Please <TextLink to="/login">Log In</TextLink>.</span>
    </>
  )
}
