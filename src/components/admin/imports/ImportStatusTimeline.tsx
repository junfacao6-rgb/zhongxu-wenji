import { AlertTriangle, CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { AdminImportStepMock } from "@/data/adminMock";

type ImportStatusTimelineProps = {
  steps: AdminImportStepMock[];
};

const statusLabelMap: Record<AdminImportStepMock["status"], string> = {
  done: "完成",
  active: "当前",
  pending: "待处理",
  blocked: "受限",
};

const iconMap = {
  done: CheckCircle2,
  active: Clock3,
  pending: Circle,
  blocked: AlertTriangle,
} satisfies Record<AdminImportStepMock["status"], typeof Circle>;

export default function ImportStatusTimeline({ steps }: ImportStatusTimelineProps) {
  return (
    <ol className="import-status-timeline" aria-label="资料处理流程">
      {steps.map((step) => {
        const Icon = iconMap[step.status];
        return (
          <li key={step.key} className={`is-${step.status}`}>
            <span className="import-step-icon">
              <Icon aria-hidden="true" />
            </span>
            <div>
              <strong>{step.label}</strong>
              <small>{statusLabelMap[step.status]}</small>
              <p>{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
