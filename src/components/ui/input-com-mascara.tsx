import { RefObject } from 'react'
import { IMaskMixin } from 'react-imask'
import { Input } from './input'

export const InputComMascara = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as RefObject<HTMLInputElement>} />
))
