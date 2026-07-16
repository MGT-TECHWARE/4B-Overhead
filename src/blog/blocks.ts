/**
 * Block types for blog article bodies. Each article in src/blog/content/<slug>.ts
 * exports a `PostBody` (an array of these blocks). BlogPost.tsx renders them.
 *
 * Paragraph / list / callout / quote text supports a tiny inline syntax:
 *   **bold**  -> <strong>
 * No HTML is allowed in text — it is rendered as plain text with that one rule.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'warning'; text: string }
  | { type: 'quote'; text: string }
  /** Reuses an existing gallery photo (filename in src/assets/gallery). */
  | { type: 'image'; file: string; alt: string; caption?: string }
  /** Inline call-to-action box; `text` is the lead-in line above the buttons. */
  | { type: 'cta'; text: string };

export type PostBody = ReadonlyArray<Block>;
