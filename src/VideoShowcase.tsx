import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import video1 from './assets/work-video-1.mp4';
import video2 from './assets/work-video-2.mp4';
import video3 from './assets/work-video-3.mp4';
import poster1 from './assets/work-video-1-poster.webp';
import poster2 from './assets/work-video-2-poster.webp';
import poster3 from './assets/work-video-3-poster.webp';

interface Clip {
  src: string;
  poster: string;
  title: string;
}

const clips: Clip[] = [
  { src: video1, poster: poster1, title: 'Two-Car Brick Home' },
  { src: video2, poster: poster2, title: 'Detached Double Garage' },
  { src: video3, poster: poster3, title: 'Twin-Bay Garage' }
];

function VideoCard({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    // Play must run in the same user gesture; the element is already mounted.
    requestAnimationFrame(() => {
      ref.current?.play().catch(() => setPlaying(false));
    });
  };

  const reset = () => {
    setPlaying(false);
    if (ref.current) ref.current.currentTime = 0;
  };

  return (
    <div className="group relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
      <video
        ref={ref}
        src={clip.src}
        poster={clip.poster}
        controls={playing}
        playsInline
        preload="none"
        onEnded={reset}
        onPause={() => { if (ref.current && ref.current.currentTime === 0) setPlaying(false); }}
        className="w-full h-full object-cover"
      />

      {!playing && (
        <button
          type="button"
          onClick={play}
          aria-label={`Play video: ${clip.title}`}
          className="absolute inset-0 flex flex-col items-center justify-end cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
        >
          <span className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/5 to-zinc-950/10 transition-colors group-hover:from-zinc-950/85" />
          <span className="relative flex items-center justify-center w-16 h-16 mb-auto mt-[calc(50%-2rem)] rounded-full bg-white/15 border border-white/30 backdrop-blur-sm text-white transition-all duration-300 group-hover:bg-white group-hover:text-zinc-950 group-hover:scale-105">
            <Play className="w-6 h-6 translate-x-0.5" fill="currentColor" />
          </span>
          <span className="relative w-full p-4 md:p-5 text-left">
            <span className="block text-sm md:text-base font-semibold text-white drop-shadow">{clip.title}</span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function VideoShowcase() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-[#0c0c0c] border-y border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Watch</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            See our work <br />
            <span className="text-zinc-400">in motion.</span>
          </h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            Real installs across West and North Texas — watch the doors we build open, close, and run smooth.
          </p>
        </div>

        {/* Portrait reels: horizontal scroll on mobile, 3-up grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {clips.map(clip => (
            <div key={clip.src} className="snap-center shrink-0 w-[76%] sm:w-[46%] md:w-auto">
              <VideoCard clip={clip} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
