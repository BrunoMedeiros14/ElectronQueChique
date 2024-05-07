import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { appLoader } from './layouts/app-loader'

const AppLayout = () => import('./layouts/app-layout')
const CaixaComponent = () => import('./pages/caixas/caixasPainel')
const EstoqueComponent = () => import('./pages/estoque/estoquePainel')
const ClientesComponent = () => import('./pages/clientes/clientesPainel')
const ContasComponent = () => import('./pages/contas/contasPainel')
const LoginPage = () => import('./pages/login')

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Navigate to="app" replace />} />
      <Route path="app" lazy={AppLayout} loader={appLoader}>
        <Route index element={<Navigate to="caixa" replace />} />
        <Route path="caixa" lazy={CaixaComponent} />
        <Route path="estoque" lazy={EstoqueComponent} />
        <Route path="clientes" lazy={ClientesComponent} />
        <Route path="contas" lazy={ContasComponent} />
      </Route>
      <Route path="login" lazy={LoginPage} />
    </Route>
  )
)