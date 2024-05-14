import { Navigate, Outlet, Route, createHashRouter, createRoutesFromElements } from 'react-router-dom'
import { appLoader } from './layouts/app-loader'

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route index element={<Navigate to='app' replace />} />
      <Route path='app' lazy={() => import('./layouts/app-layout')} loader={appLoader}>
        <Route index element={<Navigate to='caixa' replace />} />
        <Route path='caixa' element={<Outlet />}>
          <Route index lazy={() => import('./pages/caixas/CaixaLayout')} />
          <Route path='painel' lazy={() => import('./pages/caixas/caixasPainel')} />
        </Route>
        <Route path='estoque' lazy={() => import('./pages/estoque/estoquePainel')} />
        <Route path='clientes' lazy={() => import('./pages/clientes/clientesPainel')} />
        <Route path='contas' lazy={() => import('./pages/contas/contasPainel')} />
        <Route path='relatorios' lazy={() => import('./pages/relatorios/relatorioPainel')} />
      </Route>
      <Route path='login' lazy={() => import('./pages/login')} />
    </Route>
  )
)
