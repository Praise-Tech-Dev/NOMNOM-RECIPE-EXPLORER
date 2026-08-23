type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "plain";
};
export function Card({ children, className = "", variant = "default" }: CardProps) {
  const variantClasses = {
    default: "rounded-lg bg-white shadow-sm border-0 overflow-hidden",
    plain: "overflow-hidden",
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>{children}</div>
  );
}
