type ReadingProgressProps = {
  percent: number;
  label: string;
};

export default function ReadingProgress({ percent, label }: ReadingProgressProps) {
  return (
    <div className="reader-progress" aria-label="阅读进度">
      <div className="reader-progress-copy">
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="reader-progress-track">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
