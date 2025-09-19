import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { Header } from '~/components/layout/Header';

export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  return (
    <div className={clsx('page-layout flex min-h-screen flex-col bg-highlight-50', className)}>
      <Header />
      <main className="flex-auto">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};