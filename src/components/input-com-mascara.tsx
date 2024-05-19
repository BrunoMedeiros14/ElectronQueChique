import { RefObject } from 'react'
import { IMaskMixin } from 'react-imask'
import { Input } from './ui/input'

export const InputComMascara = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as RefObject<HTMLInputElement>} />
))
