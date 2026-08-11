type LoadingIndicatorProps = {
  message?: string;
};

export function LoadingIndicator({
  message = "Loading...",
}: LoadingIndicatorProps) {
  return <p>{message}</p>;
}
