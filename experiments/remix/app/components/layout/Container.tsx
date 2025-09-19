import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface ContainerProps {
  className?: string;
  children: ReactNode;
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={clsx("w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0", className)}>
      {children}
    </div>
  );
}
