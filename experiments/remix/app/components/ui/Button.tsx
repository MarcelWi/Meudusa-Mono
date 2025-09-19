import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

// Bessere Strukturierung der base classes für mehr Übersichtlichkeit
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md text-sm font-medium",
    "transition-all duration-200 ease-in-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "select-none"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-blue-600 text-primary-foreground shadow-sm",
          "hover:bg-primary/90 active:bg-primary/95",
          "focus-visible:ring-primary/50"
        ],
        destructive: [
          "bg-destructive text-destructive-foreground shadow-sm",
          "hover:bg-destructive/90 active:bg-destructive/95",
          "focus-visible:ring-destructive/50"
        ],
        outline: [
          "border border-input bg-background shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
          "focus-visible:ring-primary/50"
        ],
        secondary: [
          "bg-secondary text-secondary-foreground shadow-sm",
          "hover:bg-secondary/80 active:bg-secondary/70",
          "focus-visible:ring-secondary/50"
        ],
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
          "focus-visible:ring-primary/50"
        ],
        link: [
          "text-primary underline-offset-4",
          "hover:underline focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-visible:underline"
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        size: "sm",
        className: "h-8 px-3 text-xs",
      },
      {
        variant: "default",
        size: "lg",
        className: "h-12 px-6 text-base",
      },
      {
        variant: ["outline", "ghost"],
        size: "icon",
        className: "border-0",
      },
      {
        variant: "link",
        size: ["sm", "lg"],
        className: "px-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Separate TypeScript interface für bessere Typisierung
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
     className,
     variant,
     size,
     asChild = false,
     loading = false,
     leftIcon,
     rightIcon,
     children,
     disabled,
     ...props
   }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-loading={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-1" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-1" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
