import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

// KrabeUI's own password field (shadcn has none): an `InputGroup` with an eye
// button inside the field that shows or hides the password. Everything but
// `type` (controlled by the component) goes to the `<input>`, except
// `className`, which sizes the whole field.

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Whether the password is shown as plain text (controlled). */
  visible?: boolean
  /** Initially shown as plain text (uncontrolled). */
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  /** Accessible name of the toggle button while the password is hidden. */
  showLabel?: string
  /** Accessible name of the toggle button while the password is shown. */
  hideLabel?: string
}

function PasswordInput({
  className,
  disabled,
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  showLabel = "Show password",
  hideLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [inner, setInner] = React.useState(defaultVisible)
  const controlled = visibleProp !== undefined
  const visible = controlled ? visibleProp : inner

  const toggle = () => {
    if (!controlled) setInner(!visible)
    onVisibleChange?.(!visible)
  }

  return (
    <InputGroup data-slot="password-input" className={className}>
      <InputGroupInput
        {...props}
        type={visible ? "text" : "password"}
        disabled={disabled}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          disabled={disabled}
          // Keep the focus (and the caret) in the field when clicking with the mouse.
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggle}
          // The group already dims itself when the input is disabled.
          className="disabled:opacity-100"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { PasswordInput }
export type { PasswordInputProps }
