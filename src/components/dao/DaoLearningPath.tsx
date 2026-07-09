import type { DaoLearningStep } from "@/data/daoLearning";

interface DaoLearningPathProps {
  steps: DaoLearningStep[];
}

export default function DaoLearningPath({ steps }: DaoLearningPathProps) {
  return (
    <ol className="dao-learning-path">
      {steps.map((step, index) => (
        <li key={step.id}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
