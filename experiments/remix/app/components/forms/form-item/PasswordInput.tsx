// PasswordInput.tsx
import { useState } from "react"
import { Input } from "./Input"

export function PasswordInput(props: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
      >
        {visible ? "🙈" : "👁"}
      </button>
    </div>
  )
}
