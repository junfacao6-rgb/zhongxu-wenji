import type { BaziLearningStep } from "@/data/baziLearning";

interface BaziLearningPathProps {
  steps: BaziLearningStep[];
  compact?: boolean;
}

export default function BaziLearningPath({ steps, compact = false }: BaziLearningPathProps) {
  return (
    <ol className={`bazi-learning-path ${compact ? "is-compact" : ""}`}>
      {steps.map((step, index) => (
        <li key={step.id}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.summary}</p>
            <div>
              {step.focus.map((item) => (
                <em key={item}>{item}</em>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
