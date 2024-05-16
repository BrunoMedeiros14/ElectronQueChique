import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { caixaAtivoQueryOptions } from '../api/caixasApi'
import { CaixaAberto } from '../components/caixas/CaixaAberto'
import { ComponenteIniciarCaixa } from '../components/caixas/IniciarCaixa'

export const Route = createLazyFileRoute('/_auth/caixa')({
  component: CaixaComponent,
  pendingComponent: () => <div>Loading...</div>,
})

function CaixaComponent() {
  const { data: caixaDoDia } = useQuery(caixaAtivoQueryOptions)

  return caixaDoDia ? <CaixaAberto caixaDoDia={caixaDoDia} /> : <ComponenteIniciarCaixa />
}
