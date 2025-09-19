// FormItem.tsx
import { forwardRef } from "react"
import { Input } from "./Input"
import { Label } from "./Label"
import { cn } from "~/lib/utils"

export interface InputWithLabelProps {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
  containerClassName?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  // Achtung: neu hinzugefügt:
  inputComponent?: React.ElementType;
  inputProps?: React.ComponentProps<"input">;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export const FormItem = forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      label,
      id,
      error,
      helperText,
      required = false,
      showRequiredIndicator = true,
      containerClassName,
      type = "text",
      placeholder,
      disabled = false,
      inputComponent: InputComponent = Input,       // Standardmäßig Input
      inputProps = {},
      labelProps = {},
      ...restProps
    },
    ref
  ) => {
    const hasError = !!error;
    const hasHelperText = !!helperText && !hasError;
    const describedBy = [
      hasError ? `${id}-error` : null,
      hasHelperText ? `${id}-helper` : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={cn("grid w-full items-center gap-2", containerClassName)}>
        <Label
          htmlFor={id}
          {...labelProps}
          className={cn(
            "text-sm font-medium leading-none",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-destructive",
            disabled && "opacity-50 cursor-not-allowed",
            labelProps.className
          )}
        >
          <span className="flex items-center gap-1">
            {label}
            {required && showRequiredIndicator && (
              <span
                className="text-destructive"
                aria-label="required"
                title="Pflichtfeld"
              >
                *
              </span>
            )}
          </span>
        </Label>

        <InputComponent
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...inputProps}
          className={cn(
            hasError && [
              "border-destructive/50 text-destructive",
              "focus-visible:border-destructive focus-visible:ring-destructive/20"
            ],
            inputProps.className
          )}
          {...restProps}
        />

        {hasError && (
          <p
            id={`${id}-error`}
            className="text-xs text-destructive flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-destructive flex-shrink-0 mt-1.5" />
            {error}
          </p>
        )}

        {hasHelperText && (
          <p id={`${id}-helper`} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
);

FormItem.displayName = "FormItem";
