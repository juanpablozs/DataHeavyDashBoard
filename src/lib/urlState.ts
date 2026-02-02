import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * Type for query parameter values
 */
export type ParamValue = string | string[] | number | boolean | null | undefined;

/**
 * Hook to sync state with URL query parameters
 * Provides type-safe serialization and deserialization
 *
 * @example
 * const { params, setParam, setParams } = useUrlState({
 *   page: { default: 1, serialize: String, deserialize: Number },
 *   status: { default: [], serialize: (v) => v.join(','), deserialize: (v) => v.split(',') }
 * });
 */
export function useUrlState<T extends Record<string, ParamValue>>(config: {
  [K in keyof T]: {
    default: T[K];
    serialize?: (value: T[K]) => string;
    deserialize?: (value: string) => T[K];
  };
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Deserialize current params from URL
  const params = useMemo(() => {
    const result = {} as T;

    for (const key in config) {
      const paramConfig = config[key];
      const urlValue = searchParams.get(key);

      if (urlValue === null || urlValue === '') {
        result[key] = paramConfig.default;
      } else {
        try {
          result[key] = paramConfig.deserialize
            ? paramConfig.deserialize(urlValue)
            : (urlValue as T[typeof key]);
        } catch {
          result[key] = paramConfig.default;
        }
      }
    }

    return result;
  }, [searchParams, config]);

  // Update a single parameter
  const setParam = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const paramConfig = config[key];

        if (value === paramConfig.default || value === null || value === undefined) {
          next.delete(key as string);
        } else {
          const serialized = paramConfig.serialize
            ? paramConfig.serialize(value)
            : String(value);
          next.set(key as string, serialized);
        }

        return next;
      });
    },
    [setSearchParams, config]
  );

  // Update multiple parameters at once
  const setParams = useCallback(
    (updates: Partial<T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        for (const key in updates) {
          const value = updates[key];
          const paramConfig = config[key];

          if (value === paramConfig.default || value === null || value === undefined) {
            next.delete(key);
          } else {
            const serialized = paramConfig.serialize
              ? paramConfig.serialize(value)
              : String(value);
            next.set(key, serialized);
          }
        }

        return next;
      });
    },
    [setSearchParams, config]
  );

  // Reset all parameters to defaults
  const resetParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { params, setParam, setParams, resetParams };
}

/**
 * Common serializers/deserializers for URL state
 */
export const urlStateHelpers = {
  number: {
    serialize: (v: number) => String(v),
    deserialize: (v: string) => {
      const parsed = Number(v);
      return isNaN(parsed) ? 0 : parsed;
    },
  },
  boolean: {
    serialize: (v: boolean) => (v ? '1' : '0'),
    deserialize: (v: string) => v === '1',
  },
  stringArray: {
    serialize: (v: string[]) => v.join(','),
    deserialize: (v: string) => (v ? v.split(',').filter(Boolean) : []),
  },
  date: {
    serialize: (v: Date) => v.toISOString(),
    deserialize: (v: string) => new Date(v),
  },
};
