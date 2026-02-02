export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2.5rem',
  };

  return (
    <div
      className="loading-spinner"
      style={{ width: sizeMap[size], height: sizeMap[size] }}
      role="status"
      aria-label="Loading"
    />
  );
}
