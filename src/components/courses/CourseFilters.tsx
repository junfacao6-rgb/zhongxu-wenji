import Link from "next/link";
import type { Difficulty, SubjectKey } from "@/types/platform";

export type CourseAccessFilter = "all" | "public" | "members" | "course";
export type CourseSubjectFilter = SubjectKey | "all";
export type CourseDifficultyFilter = Difficulty | "all";

type CourseFiltersProps = {
  selectedSubject: CourseSubjectFilter;
  selectedDifficulty: CourseDifficultyFilter;
  selectedAccess: CourseAccessFilter;
};

const subjectOptions: Array<{ value: CourseSubjectFilter; label: string }> = [
  { value: "all", label: "全部学科" },
  { value: "qimen", label: "奇门" },
  { value: "bazi", label: "八字" },
  { value: "liuyao", label: "六爻" },
  { value: "meihua", label: "梅花" },
  { value: "dao", label: "道家" },
  { value: "yixue", label: "易学基础" },
];

const difficultyOptions: Array<{ value: CourseDifficultyFilter; label: string }> = [
  { value: "all", label: "全部难度" },
  { value: "入门", label: "入门" },
  { value: "进阶", label: "进阶" },
  { value: "专业", label: "专业" },
  { value: "原典", label: "原典" },
];

const accessOptions: Array<{ value: CourseAccessFilter; label: string }> = [
  { value: "all", label: "全部权限" },
  { value: "public", label: "免费" },
  { value: "members", label: "会员" },
  { value: "course", label: "课程" },
];

export default function CourseFilters({ selectedSubject, selectedDifficulty, selectedAccess }: CourseFiltersProps) {
  return (
    <section className="course-filter-panel" aria-label="课程筛选">
      <FilterGroup
        title="学科"
        options={subjectOptions}
        selectedValue={selectedSubject}
        buildHref={(value) => buildCourseHref({ subject: value, difficulty: selectedDifficulty, access: selectedAccess })}
      />
      <FilterGroup
        title="难度"
        options={difficultyOptions}
        selectedValue={selectedDifficulty}
        buildHref={(value) => buildCourseHref({ subject: selectedSubject, difficulty: value, access: selectedAccess })}
      />
      <FilterGroup
        title="免费 / 会员 / 课程"
        options={accessOptions}
        selectedValue={selectedAccess}
        buildHref={(value) => buildCourseHref({ subject: selectedSubject, difficulty: selectedDifficulty, access: value })}
      />
    </section>
  );
}

function FilterGroup<Value extends string>({
  title,
  options,
  selectedValue,
  buildHref,
}: {
  title: string;
  options: Array<{ value: Value; label: string }>;
  selectedValue: Value;
  buildHref: (value: Value) => string;
}) {
  return (
    <div>
      <span>{title}</span>
      <div>
        {options.map((option) => {
          const active = option.value === selectedValue;
          return (
            <Link key={option.value} href={buildHref(option.value)} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function buildCourseHref({
  subject,
  difficulty,
  access,
}: {
  subject: CourseSubjectFilter;
  difficulty: CourseDifficultyFilter;
  access: CourseAccessFilter;
}) {
  const params = new URLSearchParams();
  if (subject !== "all") params.set("subject", subject);
  if (difficulty !== "all") params.set("difficulty", difficulty);
  if (access !== "all") params.set("access", access);
  const query = params.toString();
  return query ? `/courses?${query}` : "/courses";
}
