import { useEffect } from 'react'

export const escutarCliqueTeclado = (callback: () => void, keys: string[]) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onKeyDown = (event: KeyboardEvent) => {
    const wasAnyKeyPressed = keys.some((key) => event.key === key)
    if (wasAnyKeyPressed) {
      event.preventDefault()
      callback()
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])
}
