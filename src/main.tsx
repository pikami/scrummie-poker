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
import { EstimationSessionProvider } from './lib/context/estimationSession';
import { EstimationContextProvider } from './lib/context/estimation';
import Estimation from './pages/Estimation/Estimation';

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

const estimationSessionRoute = createRoute({
  path: 'estimate/session/$sessionId',
  component: Estimation,
  getParentRoute: () => rootRoute,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    loginRoute,
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
    <UserProvider>
      <EstimationSessionProvider>
        <EstimationContextProvider>
          {/* TODO: Move ctx providers to layout */}
          <RouterProvider router={router} />
        </EstimationContextProvider>
      </EstimationSessionProvider>
    </UserProvider>
  </StrictMode>,
);
