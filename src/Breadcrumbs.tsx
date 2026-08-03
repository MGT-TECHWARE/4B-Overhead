import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Visible breadcrumb trail.
 *
 * Google wants the BreadcrumbList JSON-LD (src/seo/jsonld.ts) to correspond to
 * a breadcrumb the user can actually see; schema-only trails are eligible to be
 * ignored. Keep the items here in the same order as the `breadcrumb` array for
 * the matching route.
 *
 * The last item is the current page and renders as plain text, not a link.
 */
export interface Crumb {
  name: string;
  to?: string;
}

export default function Breadcrumbs({
  items,
  className = 'mb-6'
}: {
  items: ReadonlyArray<Crumb>;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-2">
              {item.to && !last ? (
                <Link to={item.to} className="hover:text-zinc-300 transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span className={last ? 'text-zinc-300' : undefined} aria-current={last ? 'page' : undefined}>
                  {item.name}
                </span>
              )}
              {!last && <ChevronRight className="w-3 h-3 text-zinc-700" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
