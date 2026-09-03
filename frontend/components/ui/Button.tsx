import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
}

type ButtonAsButton = ButtonOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonOwnProps & {
  href: string;
  children?: React.ReactNode;
  className?: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<Variant, string> = {
  // Lime pill CTA — the "Join Now" button from the reference.
  primary:
    "bg-accent text-base font-semibold hover:bg-accent-hover active:brightness-95",
  // Outlined pill for secondary actions on dark backgrounds.
  secondary:
    "bg-transparent text-ink border border-base-border hover:border-ink/40",
  // No border/fill — nav links, tertiary actions.
  ghost: "bg-transparent text-ink hover:text-accent",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-6 py-2.5",
  lg: "text-base px-8 py-3.5",
};

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return clsx(
    "inline-flex items-center justify-center rounded-pill transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = "primary", size = "md", className, children } = props;

  // Renders as an actual <a> (via next/link) when given an href, rather
  // than nesting a Link inside a <button> — that combination is invalid
  // HTML and breaks keyboard/screen-reader semantics.
  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={buttonClasses(variant, size, className)}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonAsButton & { href?: undefined };
  return (
    <button ref={ref} className={buttonClasses(variant, size, className)} {...buttonProps}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
