"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

import { queryClient } from '@/utils/trpc';

export default function Providers({ children }: { children: React.ReactNode }) {
    
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools />
      <Toaster richColors />
    </QueryClientProvider>
  );
}