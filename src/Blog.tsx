import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { POSTS, type BlogPostMeta } from './seo/posts';
import { galleryUrl } from './blog/galleryUrls';
import Breadcrumbs from './Breadcrumbs';
import { blogHeroUrl } from './blog/heroUrls';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

// Newest first.
const sorted: BlogPostMeta[] = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export default function Blog() {
  useEffect(() => {
    document.title = 'Garage Door Tips & Guides — Blog | 4B Overhead Doors';
  }, []);

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-36 md:pt-44 pb-12 md:pb-16 px-6 md:px-12 border-b border-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="max-w-7xl mx-auto relative">
          <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: 'Blog' }]} />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">The Blog</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.95] mb-6">
            Garage door <br />
            <span className="text-zinc-500">tips &amp; guides.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl font-light leading-relaxed">
            Straight advice from a family-owned Texas garage door company — buying guides, repair help, and maintenance tips for homeowners and businesses across West and North Texas.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sorted.map(post => {
            const img = blogHeroUrl(post.slug) ?? galleryUrl(post.heroImage);
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/70 hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
                  {img && (
                    <img
                      src={img}
                      alt={post.heroAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-950 bg-white px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-5 md:p-6">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                    <span>{formatDate(post.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {post.readMinutes} min read
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold tracking-tight text-white leading-snug mb-2 group-hover:text-zinc-200 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    Read article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
