type TodayOverviewProps = {
  date: string;
  title: string;
  summary: string;
  bestTime: string;
  cautiousTime: string;
  suitable: string[];
  cautious: string[];
};

export default function TodayOverview({ date, title, summary, bestTime, cautiousTime, suitable, cautious }: TodayOverviewProps) {
  return (
    <section className="today-overview">
      <div className="today-overview-main">
        <span>{date}</span>
        <h2>{title}</h2>
        <p>{summary}</p>
      </div>

      <div className="today-overview-times">
        <div>
          <span>今日最佳时段</span>
          <strong>{bestTime}</strong>
          <p>今日结构偏向清晰表达和稳步整理，可作为优先安排参考。</p>
        </div>
        <div className="is-caution">
          <span>今日慎用时段</span>
          <strong>{cautiousTime}</strong>
          <p>建议避免临时承诺、高风险决策或情绪化沟通。</p>
        </div>
      </div>

      <div className="today-overview-lists">
        <div>
          <h3>今日宜做</h3>
          <ul>
            {suitable.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>今日慎做</h3>
          <ul>
            {cautious.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
