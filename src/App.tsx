import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import CreatePage from './pages/CreatePage'
import ExplorePage from './pages/ExplorePage'
import MyCharactersPage from './pages/MyCharactersPage'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
})

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$id',
  component: ChatPage,
})

const createRoutePath = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreatePage,
})

const myCharactersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-characters',
  component: MyCharactersPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  exploreRoute,
  chatRoute,
  createRoutePath,
  myCharactersRoute,
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
