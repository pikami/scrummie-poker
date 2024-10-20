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
import { UserContextType, UserProvider, useUser } from 'src/lib/context/user';
import { EstimationsListContextProvider } from 'src/lib/context/estimationsList';
import { EstimationContextProvider } from 'src/lib/context/estimation';
import { Header, Loader } from 'src/components';
import { Estimation, Home, Join, Login, Profile } from 'src/pages';

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
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
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
    <Loader className="h-screen" fullHeight center />
  ) : (
    <RouterProvider router={router} context={{ userContext }} />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <EstimationsListContextProvider>
        <EstimationContextProvider>
          <InnerApp />
        </EstimationContextProvider>
      </EstimationsListContextProvider>
    </UserProvider>
  </StrictMode>,
);
