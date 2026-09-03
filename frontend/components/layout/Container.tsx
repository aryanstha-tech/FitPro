import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Container({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("mx-auto w-full max-w-content px-6 lg:px-10", className)} {...props}>
      {children}
    </div>
  );
}
