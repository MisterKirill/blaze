import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import Button from '../components/ui/Button'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <nav className="flex items-center justify-between px-8 bg-zinc-700 h-16">
        <Link to="/">
          <span className="font-bold">Blaze</span>
        </Link>
        
        <Link to="/signup">
          <Button>Sign Up</Button>
        </Link>
      </nav>

      <div className="flex h-full">
        <div className="md:w-56 bg-zinc-800">sidebar</div>

        <div className="p-8">
          <Outlet />
        </div>
      </div>

      <Toaster position="bottom-right" toastOptions={{ duration: 6000 }} />
    </div>
  )
}
