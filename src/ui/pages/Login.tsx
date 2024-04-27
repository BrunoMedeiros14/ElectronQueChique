// import {
//   createRoute,
//   useRouter,
//   useRouterState
// } from '@tanstack/react-router';
// import * as React from 'react';

// const fallback = '/dashboard' as const

// export const estoqueRoute = createRoute({

//   component: Estoque,
// });

// export const Route = createRoute({

//   // validateSearch: z.object({
//   //   redirect: z.string().optional().catch(''),
//   // }),
//   // beforeLoad: ({ context, search }) => {
//   //   if (context.auth.isAuthenticated) {
//   //     throw redirect({ to: search.redirect || fallback })
//   //   }
//   // },
//   // component: LoginComponent,
// })

// function LoginComponent() {
//   const auth = useAuth()
//   const router = useRouter()
//   const isLoading = useRouterState({ select: (s) => s.isLoading })
//   const navigate = Route.useNavigate()

//   const search = Route.useSearch()

//   const onFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
//     evt.preventDefault()
//     const data = new FormData(evt.currentTarget)
//     const fieldValue = data.get('username')

//     if (!fieldValue) return

//     const username = fieldValue.toString()

//     auth.login(username)

//     router.invalidate().finally(() => {
//       navigate({ to: search.redirect || fallback })
//     })
//   }

//   return (
//     <div className="p-2 grid gap-2 place-items-center">
//       <h3 className="text-xl">Login page</h3>
//       {search.redirect ? (
//         <p className="text-red-500">You need to login to access this page.</p>
//       ) : (
//         <p>Login to see all the cool content in here.</p>
//       )}
//       <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
//         <fieldset disabled={isLoading} className="w-full grid gap-2">
//           <div className="grid gap-2 items-center min-w-[300px]">
//             <label htmlFor="username-input" className="text-sm font-medium">
//               Username
//             </label>
//             <input
//               id="username-input"
//               name="username"
//               placeholder="Enter your name"
//               type="text"
//               className="border border-gray-300 rounded-md p-2 w-full"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
//           >
//             {isLoading ? 'Loading...' : 'Login'}
//           </button>
//         </fieldset>
//       </form>
//     </div>
//   )
// }

export function Login() {
  return (
    <div
      key="1"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Bem vindo de volta</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Faça o login na sua conta
            </p>
          </div>
          <form className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="usuario"
              >
                Usuário
              </label>
              <input
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                id="usuario"
                placeholder="usuário"
                type="text"
                required
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="senha"
              >
                Senha
              </label>
              <input
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                id="senha"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
            <button
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 dark:bg-[#ff6b6b] dark:hover:bg-[#ff4d4d] dark:focus:ring-[#ff6b6b] dark:focus:ring-offset-gray-800"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
