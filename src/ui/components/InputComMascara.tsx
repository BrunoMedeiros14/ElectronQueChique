import {Input} from "../../ui/components/ui/input";
import {RefObject} from "react";
import {IMaskMixin} from "react-imask";

export const InputComMascara = IMaskMixin(({inputRef, ...props}) => (
    <Input
        {...props}
        ref={inputRef as RefObject<HTMLInputElement>}
    />
));
