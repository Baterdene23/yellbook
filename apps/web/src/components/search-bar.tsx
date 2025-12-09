'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { YellowBookCategory } from '@lib/types';

interface SearchBarProps {
  categories: YellowBookCategory[] | null | undefined;
}

export function SearchBar({ categories }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [inputValue, setInputValue] = useState(searchParams.get('q') || "");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.get('category') || undefined);

  // Sync state with URL params
  useEffect(() => {
    setInputValue(searchParams.get('q') || "");
    setSelectedCategory(searchParams.get('category') || undefined);
  }, [searchParams]);

  const updateUrl = (search: string, category: string | undefined) => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('category', category);
    
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (): void => {
    updateUrl(inputValue.trim(), selectedCategory);
  };

  const handleCategorySelect = (slug: string | undefined) => {
    setSelectedCategory(slug);
    updateUrl(inputValue.trim(), slug);
  };

  const clearSearch = () => {
    setInputValue("");
    updateUrl("", selectedCategory);
  };

  return (
    <section className="bg-gray-100 border-b-2 border-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <p className="text-gray-700 font-semibold mb-3">Түлхүүр үгээр хайна уу.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Байгууллага, үйлчилгээ, байршилаар хайх ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 border-2 border-gray-300 bg-white"
              />
            </div>
            <Button
              className="bg-yellow-600 text-white hover:bg-yellow-700"
              onClick={handleSearch}
            >
              Хайх
            </Button>
            {inputValue && (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(undefined)}
              className={selectedCategory === undefined ? "bg-yellow-600 text-white" : "bg-gray-200"}
            >
              Бүх үйлчилгээ
            </Button>
            {categories && categories.map((category: YellowBookCategory) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategorySelect(category.slug)}
                className={
                  selectedCategory === category.slug
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
