---
"krabeui": minor
---

Add `PasswordInput` (`krabeui/password-input`): a password field with an eye button inside the field that shows or hides the password. Built on `InputGroup`, so it looks exactly like `Input`. Takes all props of a normal `<input>` except `type`; `className` sizes the whole field. The toggle is uncontrolled by default (`defaultVisible`), or controlled with `visible` / `onVisibleChange`. The button has `aria-pressed`, is disabled with the input, keeps the focus in the field on mouse clicks and never submits a form. Its screen-reader labels are set via `showLabel` / `hideLabel` (English defaults "Show password" / "Hide password").
