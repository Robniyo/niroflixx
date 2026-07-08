export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-secondary-200 rounded ${className}`} />;
}