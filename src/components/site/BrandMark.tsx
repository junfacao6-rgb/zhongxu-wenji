type BrandMarkProps = {
  size?: number;
  className?: string;
};

export default function BrandMark({ size = 40, className = "" }: BrandMarkProps) {
  return (
    <img
      src="/brand/wengu-seal-reference.webp"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    />
  );
}
