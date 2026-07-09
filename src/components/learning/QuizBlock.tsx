import { CheckCircle2 } from "lucide-react";

type QuizBlockProps = {
  quizId: string;
};

const quizOptions = ["直接背结论", "先确认术语和条件", "跳过原文只看工具", "把判断写成保证话术"];

export default function QuizBlock({ quizId }: QuizBlockProps) {
  return (
    <div className="lesson-quiz-block">
      <div>
        <span>练习</span>
        <strong>{quizId}</strong>
      </div>
      <p>学习本课时，更稳妥的做法是哪一项？</p>
      <ul>
        {quizOptions.map((option, index) => (
          <li key={option} className={index === 1 ? "is-answer" : ""}>
            {index === 1 ? <CheckCircle2 aria-hidden="true" /> : <span aria-hidden="true" />}
            {option}
          </li>
        ))}
      </ul>
      <small>mock 答案：先确认术语和条件。后续接真实题库时，每题都应保留 evidenceRefs。</small>
    </div>
  );
}
