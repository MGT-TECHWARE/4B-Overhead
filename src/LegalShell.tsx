import React, { useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';

/**
 * Shared chrome for the policy pages. Narrow measure, generous line height —
 * these are read, not skimmed.
 */
export default function LegalShell({
  title,
  crumb,
  effective,
  intro,
  children
}: {
  title: string;
  crumb: string;
  effective: string;
  intro: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <section className="relative pt-36 md:pt-44 pb-12 md:pb-16 px-6 md:px-12 border-b border-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="max-w-3xl mx-auto relative">
          <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: crumb }]} />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.02] mb-5">
            {title}
          </h1>
          <p className="text-zinc-500 text-sm mb-6">Effective {effective}</p>
          <p className="text-zinc-300 text-lg font-light leading-relaxed">{intro}</p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-10">{children}</div>
      </section>
    </>
  );
}

export function Clause({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4">{heading}</h2>
      <div className="space-y-4 text-zinc-400 font-light leading-relaxed">{children}</div>
    </div>
  );
}
