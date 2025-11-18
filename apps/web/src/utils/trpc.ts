import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { OrganizationKind, YellowBookCategory, YellowBookEntry } from '@lib/types';
import { YellowBookCategorySchema, YellowBookEntrySchema } from '@lib/types';

type ApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Алдаа гарлаа', {
        action: {
          label: 'Дахин оролдох',
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

function getBaseUrl() {
  const browserBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
  if (typeof window !== 'undefined') {
    return browserBaseUrl;
  }

  return process.env.INTERNAL_BACKEND_URL ?? browserBaseUrl;
}

async function apiFetch<T>(path: string, init: ApiFetchOptions = {}): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: mergeHeaders(init.headers),
    credentials: init.credentials ?? 'include',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Сүлжээний алдаа (${response.status})`);
  }

  return response.json() as Promise<T>;
}


function mergeHeaders(headers?: HeadersInit): Headers {
  const merged = new Headers(headers);

  if (!merged.has('Content-Type')) {
    merged.set('Content-Type', 'application/json');
  }

  return merged;
}

export type YellowBookListParams = {
  search?: string;
  categorySlug?: string;
  organizationType?: OrganizationKind;
  tag?: string;
};

export async function fetchYellowBookList(
  params: YellowBookListParams,
  init?: ApiFetchOptions,
): Promise<YellowBookEntry[]> {
  const url = new URL('/yellow-books', getBaseUrl());

  if (params.search) {
    url.searchParams.set('search', params.search);
  }
  if (params.categorySlug) {
    url.searchParams.set('categorySlug', params.categorySlug);
  }
  if (params.organizationType) {
    url.searchParams.set('organizationType', params.organizationType);
  }
  if (params.tag) {
    url.searchParams.set('tag', params.tag);
  }

  const data = await apiFetch<unknown>(`${url.pathname}${url.search}`, init);
  return YellowBookEntrySchema.array().parse(data);
}

export async function fetchYellowBookCategories(init?: ApiFetchOptions): Promise<YellowBookCategory[]> {
  const data = await apiFetch<unknown>('/yellow-books/categories', init);
  return YellowBookCategorySchema.array().parse(data);
}

export async function fetchYellowBookDetail(id: string, init?: ApiFetchOptions): Promise<YellowBookEntry> {
  const data = await apiFetch<unknown>(`/yellow-books/${id}`, init);
  return YellowBookEntrySchema.parse(data);
}
