type EmptyStateProps = {
  message?: string;
};

export function EmptyState({
  message = "No data found...",
}: EmptyStateProps) {
  return <p>{message}</p>;
}
