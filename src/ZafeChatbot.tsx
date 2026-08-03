import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';
import logoUrl from './assets/4b-logo.webp';
import { submitZafeLead, type ZafeMsg } from './lib/zafeLead';

/**
 * Zafe static support chatbot.
 *
 * Two modes in one widget:
 *   1. Support Q&A — `botReply` keyword-matches the visitor's question against
 *      a fixed intent set. Entirely front-end, no API key, no running cost.
 *   2. Quote flow — a 3-step scripted capture (need → name → phone/email) that
 *      POSTs a real lead to the Zafe dashboard with the full transcript
 *      attached, so a chat conversation converts the same as the contact form.
 *
 * The panel header is logo-only by design — no bot name, no "assistant".
 */

type Action =
  | { label: string; href: string }
  | { label: string; start: 'quote' };

interface Reply {
  text: string;
  actions?: Action[];
}

const PHONE_DISPLAY = '(940) 781-1186';
const PHONE_HREF = 'tel:9407811186';
const EMAIL_HREF = 'mailto:4boverheaddoorsllc@gmail.com';

/**
 * Keyword intent routing. Order matters:
 * greeting → thanks → estimate → area → services → contact → hours → trust → fallback.
 *
 * Service area is checked BEFORE services on purpose: the services bucket owns
 * "install"/"repair", so "where do you install?" would otherwise answer with a
 * service list instead of the coverage map the visitor actually asked for.
 * Keep greedy phrases like "do you" out of every bucket.
 */
function botReply(raw: string): Reply {
  const t = raw.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));

  if (/\b(hi|hey|hello|howdy|yo|hiya|good morning|good afternoon)\b/.test(t))
    return {
      text: "Hey there! 👋 Ask me about garage door installs, repairs, our service area, or grab a free quote.",
      actions: [{ label: 'Get a free quote', start: 'quote' }],
    };

  if (has('thank'))
    return { text: "You're welcome! Anything else I can help you with?" };

  if (
    has('estimate', 'quote', 'price', 'pricing', 'cost', 'how much', 'free', 'bid', 'budget')
  )
    return {
      text: 'Quotes are always free and no-obligation. Pricing depends on door size, material, insulation, and whether you need an opener — so the fastest path is a few quick details and Colten will follow up with a real number.',
      actions: [
        { label: 'Get a free quote', start: 'quote' },
        { label: `Call ${PHONE_DISPLAY}`, href: PHONE_HREF },
      ],
    };

  if (
    has(
      'area', 'location', 'where', 'serve', 'near', 'county', 'city', 'zip', 'region',
      'wichita', 'denton', 'fort worth', 'dallas', 'abilene', 'weatherford', 'vernon',
      'decatur', 'jacksboro', 'azle', 'aledo', 'springtown', 'seymour', 'olney',
      'paducah', 'texas', 'oklahoma', 'travel', 'drive'
    )
  )
    return {
      text: 'We cover West Texas, North Texas, the Texas Panhandle, and the Red River region from our base near Wichita Falls — 15 cities have their own page, including Denton, Fort Worth, Dallas, Weatherford, Abilene, and Vernon. We also travel into Oklahoma for the right project.',
      actions: [{ label: 'View service areas', href: '/service-areas' }],
    };

  if (
    has(
      'service', 'offer', 'install', 'residential', 'commercial', 'repair', 'opener',
      'spring', 'cable', 'panel', 'roller', 'insulat', 'new construction', 'builder',
      'barndominium', 'shop', 'warehouse', 'txdot', 'maintenance', 'tune'
    )
  )
    return {
      text: 'We install and repair residential garage doors, heavy-duty commercial overhead doors, and openers — plus springs, cables, rollers, and panel replacements. We also work new construction directly with builders and GCs, including TxDOT highway projects.',
      actions: [
        { label: 'See services', href: '#services' },
        { label: 'See our work', href: '/work' },
      ],
    };

  if (has('call', 'phone', 'number', 'contact', 'email', 'reach', 'talk', 'human', 'speak', 'person'))
    return {
      text: 'You can reach Colten directly — no call center, no routing:',
      actions: [
        { label: `Call ${PHONE_DISPLAY}`, href: PHONE_HREF },
        { label: 'Email us', href: EMAIL_HREF },
      ],
    };

  if (has('hour', 'open', 'time', 'availab', 'when', 'schedule', 'today', 'emergency', 'same day', 'fast', 'urgent', 'broke'))
    return {
      text: 'We run Monday–Saturday, 7am–7pm, and we take after-hours emergency calls. Most repairs in our core area get a same-day or next-day slot — broken springs get prioritized because they are not safe to leave.',
      actions: [
        { label: `Call ${PHONE_DISPLAY}`, href: PHONE_HREF },
        { label: 'Get a free quote', start: 'quote' },
      ],
    };

  if (has('licens', 'insur', 'trust', 'review', 'experience', 'safe', 'warranty', 'guarantee', 'family', 'who'))
    return {
      text: '4B Overhead Doors, LLC is a family-owned, fully insured Texas business operated by Colten Beaty. Every job is handled by our own crew — never subcontracted — and we carry liability coverage on all work.',
      actions: [{ label: 'Read reviews', href: '#reviews' }],
    };

  if (has('faq', 'question', 'help', 'guide', 'blog', 'article', 'learn'))
    return {
      text: 'We have a full FAQ on the homepage plus guides on cost, spring failure, insulation, and openers over on the blog.',
      actions: [
        { label: 'Read the FAQ', href: '#faq' },
        { label: 'Browse the blog', href: '/blog' },
      ],
    };

  return {
    text: 'Great question — I can help with our services, service area, hours, or getting you a free quote. What would you like to know?',
    actions: [
      { label: 'Get a free quote', start: 'quote' },
      { label: `Call ${PHONE_DISPLAY}`, href: PHONE_HREF },
    ],
  };
}

/** Scripted quote flow. The last two steps capture name + a phone/email. */
const QUOTE_STEPS = [
  { key: 'need', q: 'Happy to help. What do you need — a new door, a repair, or an opener?' },
  { key: 'name', q: 'Got it. What name should we put this under?' },
  { key: 'contact', q: 'And the best phone number or email for Colten to reach you?' },
] as const;

interface Msg extends ZafeMsg {
  actions?: Action[];
}

const now = () => new Date().toISOString();

const GREETING: Msg = {
  role: 'bot',
  text: "Hi! 👋 Ask about our services, service area, or get a free quote.",
  at: now(),
};

export default function ZafeChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [quoteStep, setQuoteStep] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const pushBot = (reply: Reply) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: 'bot', text: reply.text, at: now(), actions: reply.actions }]);
    }, 550);
  };

  const startQuote = () => {
    setQuoteStep(0);
    setAnswers({});
    setDone(false);
    pushBot({ text: QUOTE_STEPS[0].q });
  };

  const finishQuote = (all: Record<string, string>, transcript: Msg[]) => {
    const contact = (all.contact || '').trim();
    const isEmail = contact.includes('@');
    // Fire-and-forget: the visitor already sees the thank-you either way.
    void submitZafeLead({
      type: 'chat',
      name: all.name || 'Website visitor',
      email: isEmail ? contact : undefined,
      phone: isEmail ? undefined : contact,
      transcript: transcript.map(({ role, text, at }) => ({ role, text, at })),
      answers: [{ question: 'What do you need?', answer: all.need }],
      summary: all.need || 'Chat lead',
    });
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput('');

    const userMsg: Msg = { role: 'user', text, at: now() };
    const transcript = [...msgs, userMsg];
    setMsgs(transcript);

    // Free-form Q&A when we're not walking the quote script.
    if (quoteStep === null) {
      pushBot(botReply(text));
      return;
    }

    const step = QUOTE_STEPS[quoteStep];
    const nextAnswers = { ...answers, [step.key]: text };
    setAnswers(nextAnswers);

    if (quoteStep + 1 < QUOTE_STEPS.length) {
      setQuoteStep(quoteStep + 1);
      pushBot({ text: QUOTE_STEPS[quoteStep + 1].q });
      return;
    }

    // Last step answered — capture the lead.
    setQuoteStep(null);
    setDone(true);
    const closing: Msg = {
      role: 'bot',
      text: "Thanks! We've got your info — Colten will reach out shortly with your free quote. Need it sooner? Give us a call.",
      at: now(),
      actions: [{ label: `Call ${PHONE_DISPLAY}`, href: PHONE_HREF }],
    };
    finishQuote(nextAnswers, [...transcript, closing]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, closing]);
    }, 550);
  };

  /** Route an action chip: tel/mailto open natively, everything else stays in-SPA. */
  const runAction = (action: Action) => {
    if ('start' in action) {
      startQuote();
      return;
    }
    const { href } = action;
    if (href.startsWith('tel:') || href.startsWith('mailto:')) {
      window.location.href = href;
      return;
    }
    setOpen(false);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else navigate(`/${href}`);
      return;
    }
    navigate(href);
  };

  const quickReplies = done
    ? ['Services', 'Service area', 'Hours']
    : ['Free quote', 'Services', 'Service area', 'Hours'];

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with 4B Overhead Doors'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 flex items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg shadow-black/40 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-all"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="4B Overhead Doors chat"
          className="fixed bottom-24 right-5 z-[60] flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 w-[min(22rem,calc(100vw-2.5rem))] h-[min(30rem,calc(100dvh-9rem))]"
        >
          {/* Header — brand logo only, plus close. No bot name or subtitle. */}
          <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-[#0c0c0c] px-4 py-3">
            <img
              src={logoUrl}
              alt="4B Overhead Doors, LLC"
              width={160}
              height={87}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label="Close chat"
              className="text-zinc-400 hover:text-white transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {msgs.map((m, i) => (
              <React.Fragment key={i}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto bg-white text-zinc-950 font-medium'
                      : 'bg-zinc-900 text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {m.text}
                </div>
                {m.actions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.actions.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        onClick={() => runAction(a)}
                        className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            {typing && (
              <div
                className="flex w-fit gap-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-3"
                aria-label="Typing"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" />
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-2 border-t border-zinc-800 px-3 py-2">
            {quickReplies.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => (q === 'Free quote' ? startQuote() : send(q))}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-zinc-800 p-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={quoteStep === null ? 'Type your question…' : 'Type your answer…'}
              aria-label="Message"
              className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="border-t border-zinc-900 py-1.5 text-center text-[10px] tracking-widest uppercase text-zinc-600">
            Powered by Zafe
          </div>
        </div>
      )}
    </>
  );
}
