import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <Navbar />      

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
