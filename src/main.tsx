import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
} from '@tanstack/react-router';
import Home from './pages/Home';
import { UserContextType, UserProvider, useUser } from './lib/context/user';
import Login from './pages/Login';
import { EstimationsListContextProvider } from './lib/context/estimationsList';
import { EstimationContextProvider } from './lib/context/estimation';
import Estimation from './pages/Estimation/Estimation';
import Header from './components/Header';
import Profile from './pages/Profile';
import Join from './pages/Join';

interface RouterContext {
  userContext: UserContextType;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const authenticatedRoute = createRoute({
  id: '_authenticated',
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ location, context }) => {
    console.log(context);
    if (!context.userContext.current) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  },
});

const indexRoute = createRoute({
  path: '/',
  component: Home,
  getParentRoute: () => authenticatedRoute,
});

const loginRoute = createRoute({
  path: 'login',
  component: Login,
  getParentRoute: () => rootRoute,
});

const profileRoute = createRoute({
  path: 'profile',
  component: Profile,
  getParentRoute: () => authenticatedRoute,
});

const joinRoute = createRoute({
  path: 'join/$sessionId',
  component: Join,
  getParentRoute: () => authenticatedRoute,
});

const estimationSessionRoute = createRoute({
  path: 'estimate/session/$sessionId',
  component: Estimation,
  getParentRoute: () => authenticatedRoute,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    authenticatedRoute.addChildren([
      joinRoute,
      indexRoute,
      profileRoute,
      estimationSessionRoute,
    ]),
    loginRoute,
  ]),
  context: {
    userContext: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const userContext = useUser();

  return userContext.isLoading ? (
    <p>Loading...</p>
  ) : (
    <RouterProvider router={router} context={{ userContext }} />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <EstimationsListContextProvider>
        <EstimationContextProvider>
          {/* TODO: Move ctx providers to layout */}
          <InnerApp />
        </EstimationContextProvider>
      </EstimationsListContextProvider>
    </UserProvider>
  </StrictMode>,
);
