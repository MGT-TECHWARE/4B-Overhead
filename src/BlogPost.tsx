import { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Phone } from 'lucide-react';
import { getPost, POSTS } from './seo/posts';
import { BODIES } from './blog/content';
import type { Block } from './blog/blocks';
import { galleryUrl } from './blog/galleryUrls';
import { blogHeroUrl } from './blog/heroUrls';
import Breadcrumbs from './Breadcrumbs';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[m - 1]} ${d}, ${y}`;
}

const LINK_CLASS = 'text-white underline decoration-zinc-600 hover:decoration-white underline-offset-2 transition-colors';

/**
 * Render a tiny inline syntax inside otherwise-plain text:
 *   **bold**            -> <strong>
 *   [label](/path)      -> internal <Link>
 *   [label](https://..) -> external <a>
 * No other HTML is allowed.
 */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith('/')) {
        return <Link key={i} to={href} className={LINK_CLASS}>{label}</Link>;
      }
      return <a key={i} href={href} className={LINK_CLASS} rel="noopener noreferrer">{label}</a>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function ContactCta({ text }: { text: string }) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-zinc-800 bg-[#111] p-6 md:p-7">
      <p className="text-zinc-200 font-medium leading-relaxed mb-5">{text}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="tel:9407811186"
          className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 px-5 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
        >
          <Phone className="w-4 h-4" /> (940) 781-1186
        </a>
        <Link
          to="/#contact"
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-5 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-800 hover:border-zinc-500 transition-colors"
        >
          Get a free quote <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className="text-zinc-300 font-light leading-relaxed my-5">{renderInline(block.text)}</p>;
    case 'h2':
      return <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-12 mb-4">{block.text}</h2>;
    case 'h3':
      return <h3 className="text-xl font-bold tracking-tight text-white mt-8 mb-3">{block.text}</h3>;
    case 'ul':
      return (
        <ul className="my-5 space-y-2.5 pl-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-zinc-300 font-light leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="my-5 space-y-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-zinc-300 font-light leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ol>
      );
    case 'callout': {
      const warning = block.variant === 'warning';
      return (
        <div className={`my-7 rounded-xl border p-5 ${warning ? 'border-amber-500/30 bg-amber-500/[0.06]' : 'border-zinc-700 bg-zinc-900/60'}`}>
          <p className={`text-xs font-bold uppercase tracking-[0.15em] mb-2 ${warning ? 'text-amber-400' : 'text-zinc-400'}`}>
            {warning ? 'Safety Warning' : 'Tip'}
          </p>
          <p className="text-zinc-300 font-light leading-relaxed">{renderInline(block.text)}</p>
        </div>
      );
    }
    case 'quote':
      return (
        <blockquote className="my-8 border-l-2 border-white/60 pl-5 text-lg md:text-xl text-white font-light italic leading-relaxed">
          {block.text}
        </blockquote>
      );
    case 'image': {
      const src = galleryUrl(block.file);
      if (!src) return null;
      return (
        <figure className="my-8">
          <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img src={src} alt={block.alt} loading="lazy" decoding="async" className="w-full h-auto object-cover" />
          </div>
          {block.caption && <figcaption className="mt-3 text-sm text-zinc-500 text-center">{block.caption}</figcaption>}
        </figure>
      );
    }
    case 'cta':
      return <ContactCta text={block.text} />;
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;
  const body = slug ? BODIES[slug] : undefined;

  useEffect(() => {
    if (post) document.title = post.metaTitle;
  }, [post]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!post || !body) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Article not found</h1>
        <p className="text-zinc-400 mb-8">That post may have moved or no longer exists.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-md font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to the blog
        </Link>
      </section>
    );
  }

  const hero = blogHeroUrl(post.slug) ?? galleryUrl(post.heroImage);
  const related = post.related.map(s => getPost(s)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <article className="pb-8">
      {/* Header */}
      <header className="pt-32 md:pt-40 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            items={[
              { name: 'Home', to: '/' },
              { name: 'Blog', to: '/blog' },
              { name: post.title }
            ]}
          />
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-950 bg-white px-2.5 py-1 rounded-full mb-5">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.08] mb-5">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span>{formatDate(post.date)}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readMinutes} min read</span>
          </div>
        </div>
      </header>

      {/* Hero image */}
      {hero && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-10">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-[16/9]">
            <img src={hero} alt={post.heroAlt} loading="eager" decoding="async" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 mt-10 md:mt-12">
        {body.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>

      {/* FAQ */}
      {post.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 md:px-12 mt-14">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">Frequently asked questions</h2>
          <div className="divide-y divide-zinc-900 border-y border-zinc-900">
            {post.faqs.map((f, i) => (
              <details key={i} className="group py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none text-white font-semibold">
                  {f.q}
                  <span className="shrink-0 mt-1 text-zinc-500 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-zinc-400 font-light leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 md:px-12 mt-16">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6">Read next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map(r => {
              const img = blogHeroUrl(r.slug) ?? galleryUrl(r.heroImage);
              return (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/70 hover:border-zinc-600 transition-colors"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-zinc-800">
                    {img && <img src={img} alt={r.heroAlt} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{r.category}</span>
                    <h3 className="mt-1 text-sm font-semibold text-white leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2">{r.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 md:mt-20 py-16 md:py-20 px-6 md:px-12 border-t border-zinc-900 bg-[#0c0c0c]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">Need a garage door pro in Texas?</h2>
          <p className="text-zinc-400 mb-8 font-light">Family-owned, fully insured, and serving West &amp; North Texas. Free quotes on installs, repairs, and new builds.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:9407811186" className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors">
              <Phone className="w-4 h-4" /> (940) 781-1186
            </a>
            <Link to="/blog" className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-800 hover:border-zinc-500 transition-colors">
              <ArrowLeft className="w-4 h-4" /> More articles
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
