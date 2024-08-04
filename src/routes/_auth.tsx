import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router'

import { LogOut, Menu, Package2, ShoppingBag, Table2Icon, Users, Wallet } from 'lucide-react'
import { lazy, Suspense, useRef, useState } from 'react'

import Logo from '../assets/Logo.png'
import { SidebarLi } from '../components/lib/sidebar-li'
import { Dialog, DialogTrigger } from '../components/ui/dialog'
import { useAuth } from '../hooks/use-auth'

const GerarRelatorioComponent = lazy(() => import('../components/relatorios/gerar-relatorio-component'))

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  const [menuAtivo, setMenuAtivo] = useState(true)
  const [mostrarPopupRelatorio, setMostrarPopupRelatorio] = useState(false)
  const refBotaoRelatorio = useRef<HTMLButtonElement | null>()
  const auth = useAuth()
  const router = useRouter()
  const navigate = Route.useNavigate()
  const handleLogout = () => {
    auth.logout()

    router.invalidate().finally(() => {
      navigate({ to: '/login', replace: true })
    })
  }

  return (
    <>
      <aside
        id='sidebar-multi-level-sidebar'
        className={`fixed left-0 top-0 z-40 transition-all ease-linear ${menuAtivo ? 'w-64' : 'w-16'} h-screen`}
        aria-label='Sidebar'>
        <div className='flex h-full flex-col justify-between overflow-y-auto bg-gray-100 px-3 py-4'>
          <ul className='space-y-2 font-medium'>
            <li className='flex h-12 items-center justify-between'>
              {menuAtivo && <img src={Logo} alt='Logomarca que Chique' className='h-full ps-2' />}
              <button
                onClick={() => setMenuAtivo(!menuAtivo)}
                className='group right-0 flex w-fit items-center rounded-lg p-2 text-gray-900 hover:bg-gray-200 [&.active]:bg-gray-200 [&.active]:bg-opacity-75'>
                <Menu />
              </button>
            </li>
            <SidebarLi icone={<ShoppingBag />} texto='Caixa' to='/caixa' ativo={menuAtivo} />
            <SidebarLi icone={<Package2 />} texto='Produtos' to='/estoque' ativo={menuAtivo} />
            <SidebarLi icone={<Users />} texto='Clientes' to='/clientes' ativo={menuAtivo} />
            <SidebarLi icone={<Wallet />} texto='Contas' to='/contas' ativo={menuAtivo} />
            <li>
              <button
                onClick={() => refBotaoRelatorio.current.click()}
                className='group flex w-full cursor-pointer items-center rounded-lg p-2 text-gray-900 hover:bg-gray-200 [&.active]:bg-gray-200 [&.active]:bg-opacity-75'>
                <Table2Icon />
                {menuAtivo && <span className='ms-3'>Relatórios</span>}
              </button>
            </li>
          </ul>
          <ul>
            <li>
              <button
                onClick={handleLogout}
                className='group flex w-full cursor-pointer items-center rounded-lg p-2 font-medium text-gray-900 hover:bg-gray-200 [&.active]:bg-gray-200 [&.active]:bg-opacity-75'>
                <LogOut />
                {menuAtivo && <span className='ms-3'>Sair da aplicação</span>}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className={`p-4 ${menuAtivo ? 'ml-64' : 'ml-16'}`}>
        <Outlet />
        <Dialog onOpenChange={setMostrarPopupRelatorio}>
          <DialogTrigger ref={refBotaoRelatorio} />
          {mostrarPopupRelatorio && (
            <Suspense>
              <GerarRelatorioComponent />
            </Suspense>
          )}
        </Dialog>
      </div>
    </>
  )
}
