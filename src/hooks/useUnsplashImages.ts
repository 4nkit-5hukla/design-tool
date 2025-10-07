import { useState, useCallback } from 'react';
import { createApi } from 'unsplash-js';
import { UnsplashImage } from '../types';

interface UseUnsplashResult {
  images: UnsplashImage[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalImages: number;
  currentPage: number;
  searchImages: (query: string, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook for Unsplash image integration with fixed pagination
 * Fixes the bug where last 3 items of page N duplicate on page N+1
 */
export const useUnsplashImages = (): UseUnsplashResult => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());

  const unsplash = createApi({
    accessKey: import.meta.env.REACT_APP_UNSPLASH_ACCESS_KEY ?? '',
    fetch: window.fetch,
  });

  const perPage = 20;

  const searchImages = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { response, errors } = await unsplash.search.getPhotos({
        query,
        page,
        perPage,
        orientation: 'landscape',
      });

      if (errors) {
        throw new Error(errors[0]);
      }

      if (response) {
        const { results, total } = response;
        
        // Check if this is a new search
        const isNewSearch = page === 1 || query !== currentQuery;
        
        if (isNewSearch) {
          // New search - reset loaded IDs and replace images
          setImages(results);
          setLoadedImageIds(new Set(results.map(img => img.id)));
          setCurrentQuery(query);
        } else {
          // Load more - filter duplicates and append
          const newImages = results.filter(img => !loadedImageIds.has(img.id));
          const newImageIds = new Set(loadedImageIds);
          newImages.forEach(img => newImageIds.add(img.id));
          
          setImages(prev => [...prev, ...newImages]);
          setLoadedImageIds(newImageIds);
        }

        setTotalImages(total);
        setCurrentPage(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
      console.error('Unsplash search error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentQuery, loadedImageIds]);

  const loadMore = useCallback(async () => {
    if (!currentQuery || loading) return;
    
    const nextPage = currentPage + 1;
    await searchImages(currentQuery, nextPage);
  }, [currentQuery, currentPage, loading, searchImages]);

  const reset = useCallback(() => {
    setImages([]);
    setCurrentPage(1);
    setTotalImages(0);
    setCurrentQuery('');
    setLoadedImageIds(new Set());
    setError(null);
  }, []);

  const hasMore = images.length < totalImages;

  return {
    images,
    loading,
    error,
    hasMore,
    totalImages,
    currentPage,
    searchImages,
    loadMore,
    reset,
  };
};
