import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to?: string; // si no tiene `to`, se asume que es el último
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav
      className={`text-md text-gray-600 flex flex-col items-start md:flex-row md:items-center space-x-1 mb-2 ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div className="flex items-center" key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1 shrink-0" />
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="hover:underline hover:text-main-300 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
