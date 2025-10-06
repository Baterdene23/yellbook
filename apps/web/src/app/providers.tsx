"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { queryClient } from "@/utils/trpc";
import { Toaster } from "sonner";
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'


export default function Providers({ children }: { children: React.ReactNode }) {
    return (

        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryStreamedHydration>
                <NuqsAdapter>
                    {children}
                </NuqsAdapter>
                </ReactQueryStreamedHydration>
                <ReactQueryDevtools />
            <Toaster richColors />
            </QueryClientProvider>
        </>

    );
}