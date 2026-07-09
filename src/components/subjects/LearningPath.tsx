type LearningPathProps = {
  steps: string[];
  compact?: boolean;
};

export default function LearningPath({ steps, compact = false }: LearningPathProps) {
  return (
    <ol className={`subject-learning-path ${compact ? "is-compact" : ""}`}>
      {steps.map((step, index) => (
        <li key={`${step}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{step}</p>
        </li>
      ))}
    </ol>
  );
}
