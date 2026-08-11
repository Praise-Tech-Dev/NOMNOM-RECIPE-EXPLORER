type CardProps = {
  children: React.ReactNode;
  className?: string;
};
export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-lg
        overflow-hidden
        bg-white
        shadow-sm
        border-0
        ${className}
      `}
    >
      {children}
    </div>
  );
}
