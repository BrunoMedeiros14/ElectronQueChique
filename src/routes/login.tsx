import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    logout: z.boolean().optional().catch(false),
  }),
  beforeLoad: ({ context, search }) => {
    if (search.logout) {
      context.auth.logout()
      return
    }
  },
  loader: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/caixa',
      })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const auth = useAuth()
  const router = useRouter()
  const navigate = Route.useNavigate()
  const [errorLogin, setErrorLogin] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const usuario = formData.get('usuario').toString()
    const senha = formData.get('senha').toString()

    const isLoginSuccessful = auth.login(usuario, senha)

    if (!isLoginSuccessful) {
      setErrorLogin(true)
      return
    }

    router.invalidate().finally(() => {
      navigate({ to: '/caixa', replace: true })
    })
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900'>
        <div className='space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Bem vindo de volta</h2>
            <p className='text-gray-500 dark:text-gray-400'>Faça o login na sua conta</p>
          </div>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300' htmlFor='usuario'>
                Usuário
              </label>
              <input
                className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400'
                id='usuario'
                placeholder='usuário'
                type='text'
                name='usuario'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300' htmlFor='senha'>
                Senha
              </label>
              <input
                className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400'
                id='senha'
                placeholder='••••••••'
                type='password'
                name='senha'
                required
              />
            </div>
            {errorLogin && (
              <div className='border border-red-700 bg-red-100 text-red-700 p-2 rounded-md'>
                Usuário ou Senha incorreto, favor tentar novamente.
              </div>
            )}
            <button
              className='w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 dark:bg-[#ff6b6b] dark:hover:bg-[#ff4d4d] dark:focus:ring-[#ff6b6b] dark:focus:ring-offset-gray-800'
              type='submit'>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
