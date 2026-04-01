import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import RootLayout from './layout/RootLayout'
import HomePage from './pages/HomePage'
import Contact from './components/Contact'

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})

const routeTree = rootRoute.addChildren([indexRoute, contactRoute])

export const router = createRouter({ routeTree })
