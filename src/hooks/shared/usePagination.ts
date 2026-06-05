import {useState, useCallback} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {PaginatedResult} from '@mytypes/common.types';

type Cursor = FirebaseFirestoreTypes.DocumentSnapshot | null;

interface UsePaginationResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  fetchFirst: () => Promise<void>;
  fetchMore: () => Promise<void>;
  reset: () => void;
}

export const usePagination = <T>(
  fetcher: (cursor: Cursor) => Promise<PaginatedResult<T>>,
): UsePaginationResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFirst = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher(null);
      setData(result.data);
      setCursor(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await fetcher(cursor);
      setData(prev => [...prev, ...result.data]);
      setCursor(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, fetcher, hasMore, isLoadingMore]);

  const reset = useCallback(() => {
    setData([]);
    setCursor(null);
    setHasMore(false);
    setError(null);
  }, []);

  return {data, isLoading, isLoadingMore, hasMore, error, fetchFirst, fetchMore, reset};
};
