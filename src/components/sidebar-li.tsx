import { Link } from '@tanstack/react-router'
import { ToSubOptionsProps } from '@tanstack/react-router/dist/esm/link'

import { ReactNode } from 'react'

interface SidebarLiProps extends ToSubOptionsProps {
  texto: string
  icone: ReactNode
  ativo?: boolean
}

export const SidebarLi = ({ texto, to, icone, ativo }: SidebarLiProps) => {
  return (
    <li>
      <Link
        to={to}
        className='flex items-center p-2 text-gray-900 rounded-lg group [&.active]:bg-gray-200 [&.active]:pointer-events-none [&.active]:bg-opacity-75 hover:bg-gray-200'>
        {icone}
        {ativo && <span className='ms-3'>{texto}</span>}
      </Link>
    </li>
  )
}
