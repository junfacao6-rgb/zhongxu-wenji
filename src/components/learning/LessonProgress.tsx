type LessonProgressProps = {
  currentOrder: number;
  totalLessons: number;
  progressPercent: number;
};

export default function LessonProgress({ currentOrder, totalLessons, progressPercent }: LessonProgressProps) {
  return (
    <section className="learning-progress" aria-label={`课程学习进度 ${progressPercent}%`}>
      <div>
        <span>学习进度</span>
        <strong>{progressPercent}%</strong>
      </div>
      <progress value={progressPercent} max={100} />
      <p>
        第 {currentOrder} 课 / 共 {totalLessons} 课
      </p>
    </section>
  );
}
