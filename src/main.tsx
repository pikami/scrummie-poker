import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import Home from './pages/Home';
import { UserProvider } from './lib/context/user';
import Login from './pages/Login';
import EstimationSession from './pages/EstimationSession';
import CreateEstimationSession from './pages/CreateEstimationSession';
import { EstimationSessionProvider } from './lib/context/estimationSession';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  path: '/',
  component: Home,
  getParentRoute: () => rootRoute,
});

const loginRoute = createRoute({
  path: 'login',
  component: Login,
  getParentRoute: () => rootRoute,
});

const createEstimationSessionRoute = createRoute({
  path: 'estimate/new',
  component: CreateEstimationSession,
  getParentRoute: () => rootRoute,
});

const estimationSessionRoute = createRoute({
  path: 'estimate/session/$sessionId',
  component: EstimationSession,
  getParentRoute: () => rootRoute,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    loginRoute,
    createEstimationSessionRoute,
    estimationSessionRoute,
  ]),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EstimationSessionProvider>
      {/* TODO: Move ctx providers to layout */}
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </EstimationSessionProvider>
  </StrictMode>,
);
