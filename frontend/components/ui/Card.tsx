import { HTMLAttributes } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean; // adds hover lift, use for clickable cards (products, packages)
}

export function Card({ interactive = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-card border border-base-border bg-base-surface p-6 shadow-card",
        interactive && "transition-transform duration-150 hover:-translate-y-0.5 hover:border-ink/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("mb-4 flex items-start justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx("font-display text-display-sm text-ink", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("mt-6 flex items-center justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}
