type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div>
      <p>{message}</p>

      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}
