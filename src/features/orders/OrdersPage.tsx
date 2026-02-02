import { useOrdersTableState } from './hooks/useOrdersTableState';
import { useOrdersQuery } from './hooks/useOrdersQuery';
import OrdersTable from './components/OrdersTable';
import OrdersFilters from './components/OrdersFilters';

export default function OrdersPage() {
  const {
    queryParams,
    setPage,
    setPageSize,
    setSearch,
    setStatus,
    setCountry,
    setDateRange,
    setSorting,
    resetFilters,
  } = useOrdersTableState();

  const { data, isLoading, error, refetch } = useOrdersQuery(queryParams);

  if (error) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="error-message">
          <h3 style={{ marginBottom: '0.5rem' }}>Failed to load orders</h3>
          <p style={{ marginBottom: '1rem' }}>{(error as Error).message}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Orders</h1>

      <OrdersFilters
        search={queryParams.search}
        status={queryParams.status}
        country={queryParams.country}
        dateRange={{ from: queryParams.from, to: queryParams.to }}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCountryChange={setCountry}
        onDateRangeChange={setDateRange}
        onReset={resetFilters}
      />

      <OrdersTable
        data={data?.data || []}
        isLoading={isLoading}
        page={queryParams.page}
        pageSize={queryParams.pageSize}
        total={data?.total || 0}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSort={setSorting}
        currentSort={{ column: queryParams.sortBy, direction: queryParams.sortOrder }}
      />
    </div>
  );
}
