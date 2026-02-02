import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useUrlState, urlStateHelpers } from '@/lib/urlState';

// Wrapper for router context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useUrlState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(
      () =>
        useUrlState({
          page: { default: 1, ...urlStateHelpers.number },
          search: { default: '' },
        }),
      { wrapper }
    );

    expect(result.current.params.page).toBe(1);
    expect(result.current.params.search).toBe('');
  });

  it('should update URL params when setParam is called', () => {
    const { result } = renderHook(
      () =>
        useUrlState({
          page: { default: 1, ...urlStateHelpers.number },
        }),
      { wrapper }
    );

    act(() => {
      result.current.setParam('page', 2);
    });

    expect(result.current.params.page).toBe(2);
  });

  it('should handle array serialization', () => {
    const { result } = renderHook(
      () =>
        useUrlState({
          status: { default: [], ...urlStateHelpers.stringArray },
        }),
      { wrapper }
    );

    act(() => {
      result.current.setParam('status', ['pending', 'paid']);
    });

    expect(result.current.params.status).toEqual(['pending', 'paid']);
  });

  it('should reset params to defaults', () => {
    const { result } = renderHook(
      () =>
        useUrlState({
          page: { default: 1, ...urlStateHelpers.number },
          search: { default: '' },
        }),
      { wrapper }
    );

    act(() => {
      result.current.setParam('page', 5);
      result.current.setParam('search', 'test');
    });

    expect(result.current.params.page).toBe(5);
    expect(result.current.params.search).toBe('test');

    act(() => {
      result.current.resetParams();
    });

    expect(result.current.params.page).toBe(1);
    expect(result.current.params.search).toBe('');
  });
});
