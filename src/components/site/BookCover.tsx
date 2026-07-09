type BookCoverProps = {
  title: string;
  tone?: "teal" | "cinnabar" | "indigo" | "ochre" | "earth";
  className?: string;
  imageSrc?: string;
};

export default function BookCover({ title, tone = "earth", className = "", imageSrc }: BookCoverProps) {
  if (imageSrc) {
    return (
      <div className={`wen-gu-cover wen-gu-cover-image wen-gu-cover-${tone} ${className}`}>
        <img src={imageSrc} alt={`${title}封面`} />
      </div>
    );
  }

  return (
    <div className={`wen-gu-cover wen-gu-cover-${tone} ${className}`}>
      <i aria-hidden="true" />
      <span>{title}</span>
    </div>
  );
}
