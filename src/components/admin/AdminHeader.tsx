import { Search, ShieldAlert } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminHeaderProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
};

export default function AdminHeader({ title, description, breadcrumbs }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-breadcrumb" aria-label="面包屑">
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {index > 0 ? <em>/</em> : null}
            {item.label}
          </span>
        ))}
      </div>

      <div className="admin-header-main">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="admin-header-tools">
          <label>
            <Search aria-hidden="true" />
            <input placeholder="搜索资料、课程、术语" />
          </label>
          <span>
            <ShieldAlert aria-hidden="true" />
            未授权资料不得公开
          </span>
        </div>
      </div>
    </header>
  );
}
