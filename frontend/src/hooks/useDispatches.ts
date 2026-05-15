import { useState, useEffect, useCallback } from 'react';
import { Dispatch, DispatchCreate } from '../types/dispatch';
import { dispatchApi } from '../api/dispatch';

interface UseDispatchesReturn {
  dispatches: Dispatch[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDispatches(): UseDispatchesReturn {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dispatchApi.getDispatches();
      setDispatches(response.dispatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dispatches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { dispatches, loading, error, refetch };
}

interface UseCreateDispatchReturn {
  createDispatch: (data: DispatchCreate) => Promise<Dispatch>;
  loading: boolean;
  error: string | null;
}

export function useCreateDispatch(): UseCreateDispatchReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDispatch = useCallback(async (data: DispatchCreate): Promise<Dispatch> => {
    try {
      setLoading(true);
      setError(null);
      const result = await dispatchApi.createDispatch(data);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create dispatch';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createDispatch, loading, error };
}

interface UseDispatchStatsReturn {
  stats: { plant: string; total_quantity: number; dispatch_count: number }[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDispatchStats(): UseDispatchStatsReturn {
  const [stats, setStats] = useState<{ plant: string; total_quantity: number; dispatch_count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dispatchApi.getStats();
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { stats, loading, error, refetch };
}

interface UseDeleteDispatchReturn {
  deleteDispatch: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useDeleteDispatch(): UseDeleteDispatchReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDispatch = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await dispatchApi.deleteDispatch(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete dispatch';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteDispatch, loading, error };
}

interface UseSingleDispatchReturn {
  dispatch: Dispatch | null;
  loading: boolean;
  error: string | null;
  refetch: (id: number) => Promise<void>;
}

export function useSingleDispatch(): UseSingleDispatchReturn {
  const [dispatch, setDispatch] = useState<Dispatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dispatchApi.getDispatch(id);
      setDispatch(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dispatch');
    } finally {
      setLoading(false);
    }
  }, []);

  return { dispatch, loading, error, refetch };
}