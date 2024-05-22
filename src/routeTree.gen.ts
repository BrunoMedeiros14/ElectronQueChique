import { createFileRoute } from '@tanstack/react-router'

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as IndexImport } from './routes/index'

const AuthEstoqueLazyImport = createFileRoute('/_auth/estoque')()
const AuthContasLazyImport = createFileRoute('/_auth/contas')()
const AuthClientesLazyImport = createFileRoute('/_auth/clientes')()
const AuthCaixaLazyImport = createFileRoute('/_auth/caixa')()

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthEstoqueLazyRoute = AuthEstoqueLazyImport.update({
  path: '/estoque',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/_auth.estoque.lazy').then((d) => d.Route))

const AuthContasLazyRoute = AuthContasLazyImport.update({
  path: '/contas',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/_auth.contas.lazy').then((d) => d.Route))

const AuthClientesLazyRoute = AuthClientesLazyImport.update({
  path: '/clientes',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth.clientes.lazy').then((d) => d.Route),
)

const AuthCaixaLazyRoute = AuthCaixaLazyImport.update({
  path: '/caixa',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/_auth.caixa.lazy').then((d) => d.Route))

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/caixa': {
      id: '/_auth/caixa'
      path: '/caixa'
      fullPath: '/caixa'
      preLoaderRoute: typeof AuthCaixaLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/clientes': {
      id: '/_auth/clientes'
      path: '/clientes'
      fullPath: '/clientes'
      preLoaderRoute: typeof AuthClientesLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/contas': {
      id: '/_auth/contas'
      path: '/contas'
      fullPath: '/contas'
      preLoaderRoute: typeof AuthContasLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/estoque': {
      id: '/_auth/estoque'
      path: '/estoque'
      fullPath: '/estoque'
      preLoaderRoute: typeof AuthEstoqueLazyImport
      parentRoute: typeof AuthImport
    }
  }
}

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AuthRoute: AuthRoute.addChildren({
    AuthCaixaLazyRoute,
    AuthClientesLazyRoute,
    AuthContasLazyRoute,
    AuthEstoqueLazyRoute,
  }),
  LoginRoute,
})
