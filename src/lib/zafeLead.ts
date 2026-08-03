// Zafe lead capture — the single place this site talks to the Zafe platform.
//
// Every lead source (the homepage contact form, the chatbot) posts here so
// leads land in the Zafe dashboard Leads inbox. This is always fire-and-forget:
// the Gmail SMTP email from functions/api/contact.js is the source of truth for
// notifying the office, and a Zafe outage must never block or fail a submit.
//
// The browser POSTs directly rather than proxying through a Pages Function so
// the request carries an Origin header matching the widget's allowed_origins
// allowlist (https://4boverheaddoors.com). Proxying server-side would send no
// Origin and the capture endpoint would reject it.

export const ZAFE_ENDPOINT =
  'https://ufshuedarhueuituppjo.supabase.co/functions/v1/capture';
export const ZAFE_APIKEY = 'sb_publishable_pdkOzNe8XMP9lI23RKdY8Q_XSSOi8Zp';
export const ZAFE_PUBLIC_KEY = '3fb1ed374de9a1495b8b652b0a210d44eed862360e0d8b3d';

export type ZafeMsg = { role: 'bot' | 'user'; text: string; at: string };

export interface ZafeLeadInput {
  /** 'form' for the contact form, 'chat' for the chatbot transcript. */
  type: 'form' | 'chat';
  name: string;
  email?: string;
  phone?: string;
  /** Question/answer pairs — blanks are dropped, Zafe rejects empty answers. */
  answers?: Array<{ question: string; answer: string | undefined }>;
  summary?: string;
  transcript?: ZafeMsg[];
}

/**
 * Send a lead to Zafe. Never throws and never rejects — callers can `void` it.
 * Returns true only when Zafe confirmed the lead was stored.
 */
export async function submitZafeLead(input: ZafeLeadInput): Promise<boolean> {
  const name = input.name.trim() || 'Website visitor';
  const email = input.email?.trim() || undefined;
  const phone = input.phone?.trim() || undefined;

  // Zafe requires a name plus at least one of phone/email; without them the
  // request would 400 and we'd just be burning a round trip.
  if (!email && !phone) return false;

  try {
    const response = await fetch(ZAFE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: ZAFE_APIKEY },
      body: JSON.stringify({
        publicKey: ZAFE_PUBLIC_KEY,
        type: input.type,
        contact: { name, email, phone },
        answers: (input.answers ?? [])
          .filter((a) => a.answer && a.answer.trim())
          .map((a) => ({ question: a.question, answer: a.answer!.trim() })),
        summary: input.summary?.trim() || undefined,
        transcript: input.transcript,
        sourceUrl: typeof location !== 'undefined' ? location.href : undefined,
        website: '', // honeypot — must stay empty for real submissions
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
