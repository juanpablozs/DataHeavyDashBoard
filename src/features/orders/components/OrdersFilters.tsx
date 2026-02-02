import { useState, useEffect } from 'react';
import { debounce } from '@/lib/utils';
import type { OrderStatus } from '../types';

interface OrdersFiltersProps {
  search: string;
  status: OrderStatus[];
  country: string;
  dateRange: { from: string; to: string };
  onSearchChange: (search: string) => void;
  onStatusChange: (status: OrderStatus[]) => void;
  onCountryChange: (country: string) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onReset: () => void;
}

const COUNTRIES = [
  'USA',
  'Canada',
  'UK',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Australia',
  'Japan',
  'Brazil',
  'Mexico',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
];

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled', 'refunded'];

const DATE_PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export default function OrdersFilters({
  search,
  status,
  country,
  dateRange,
  onSearchChange,
  onStatusChange,
  onCountryChange,
  onDateRangeChange,
  onReset,
}: OrdersFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onSearchChange(searchInput);
    }, 300);

    debouncedSearch();
  }, [searchInput, onSearchChange]);

  // Sync search input with prop changes (e.g., when reset)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleStatusToggle = (statusValue: OrderStatus) => {
    if (status.includes(statusValue)) {
      onStatusChange(status.filter((s) => s !== statusValue));
    } else {
      onStatusChange([...status, statusValue]);
    }
  };

  const handleDatePreset = (days: number) => {
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    onDateRangeChange(from, to);
  };

  const hasActiveFilters =
    search || status.length > 0 || country || dateRange.from || dateRange.to;

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ margin: 0 }}>Filters</h3>
        {hasActiveFilters && (
          <button onClick={onReset} className="secondary">
            Reset All
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Customer name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}
          >
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">All countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label
            htmlFor="dateFrom"
            style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}
          >
            From
          </label>
          <input
            id="dateFrom"
            type="date"
            value={dateRange.from}
            onChange={(e) => onDateRangeChange(e.target.value, dateRange.to)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Date To */}
        <div>
          <label
            htmlFor="dateTo"
            style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}
          >
            To
          </label>
          <input
            id="dateTo"
            type="date"
            value={dateRange.to}
            onChange={(e) => onDateRangeChange(dateRange.from, e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Date presets */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {DATE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handleDatePreset(preset.days)}
            className="secondary"
            style={{ fontSize: '0.75rem' }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Status filters */}
      <div style={{ marginTop: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          Status
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STATUSES.map((s) => (
            <label
              key={s}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: status.includes(s) ? '#f0f0f0' : 'white',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={status.includes(s)}
                onChange={() => handleStatusToggle(s)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{s}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
