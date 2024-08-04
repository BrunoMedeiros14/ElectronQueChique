import { useEffect } from 'react'

export const useEscutarCliqueTeclado = (callback: () => void, keys: string[]) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const wasAnyKeyPressed = keys.some((key) => event.key === key)
      if (wasAnyKeyPressed) {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [callback, keys])
}
