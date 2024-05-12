export function Component() {
  return (
    <div
      key='1'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
    >
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900'>
        <div className='space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Bem vindo de volta</h2>
            <p className='text-gray-500 dark:text-gray-400'>
              Faça o login na sua conta
            </p>
          </div>
          <form className='space-y-4'>
            <div>
              <label
                className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                htmlFor='usuario'
              >
                Usuário
              </label>
              <input
                className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400'
                id='usuario'
                placeholder='usuário'
                type='text'
                required
              />
            </div>
            <div>
              <label
                className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                htmlFor='senha'
              >
                Senha
              </label>
              <input
                className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400'
                id='senha'
                placeholder='••••••••'
                type='password'
                required
              />
            </div>
            <button
              className='w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 dark:bg-[#ff6b6b] dark:hover:bg-[#ff4d4d] dark:focus:ring-[#ff6b6b] dark:focus:ring-offset-gray-800'
              type='submit'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
