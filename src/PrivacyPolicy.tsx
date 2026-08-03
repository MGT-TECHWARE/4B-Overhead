import { BUSINESS } from './seo/site';
import LegalShell, { Clause } from './LegalShell';

/**
 * NOTE FOR REVIEW: this describes the data flows this site actually implements
 * as of the effective date below —
 *   - contact form  -> Gmail SMTP (functions/api/contact.js) + Zafe (src/lib/zafeLead.ts)
 *   - chatbot       -> Zafe, including the message transcript
 *   - page views    -> Zafe track-view (path + referrer only, no cookies)
 * If any of those change, this page has to change with them. It is written to
 * be accurate, not to be legal advice — have the business confirm it before
 * relying on it, especially if they later add ad pixels or a CRM.
 */
export default function PrivacyPolicy() {
  return (
    <LegalShell
      title="Privacy Policy"
      crumb="Privacy Policy"
      effective="August 2, 2026"
      intro={`This policy explains what ${BUSINESS.legalName} collects through this website, why we collect it, and who it is shared with.`}
    >
      <Clause heading="Who we are">
        <p>
          {BUSINESS.legalName} is a garage door installation and repair company operating in West
          Texas, North Texas, the Texas Panhandle, and the Red River region. You can reach us at{' '}
          <a href={`tel:${BUSINESS.phone.replace(/\D/g, '').slice(-10)}`} className="text-white underline underline-offset-4">
            {BUSINESS.phoneDisplay}
          </a>{' '}
          or{' '}
          <a href={`mailto:${BUSINESS.emailBusiness}`} className="text-white underline underline-offset-4 break-all">
            {BUSINESS.emailBusiness}
          </a>
          .
        </p>
      </Clause>

      <Clause heading="What we collect">
        <p>
          <span className="text-zinc-200">Information you give us.</span> When you submit the
          contact form or use the chat widget, we collect the name, phone number, email address,
          service type, and message you enter. In the chat widget, the conversation transcript is
          submitted along with your contact details.
        </p>
        <p>
          <span className="text-zinc-200">Basic page-view data.</span> We record which pages are
          visited and the referring website. This is aggregate traffic data — it is not tied to a
          name, and we do not build advertising profiles from it.
        </p>
        <p>
          <span className="text-zinc-200">What we do not collect.</span> This site does not use
          cookies, local storage, advertising pixels, or cross-site trackers. We do not collect
          payment information through the website, and we do not knowingly collect information from
          children under 13.
        </p>
      </Clause>

      <Clause heading="Why we collect it">
        <p>
          Solely to respond to your inquiry, quote and schedule work, and keep a record of customer
          requests so nothing gets lost. Page-view data is used to understand which pages are
          useful. We do not sell your information, and we do not share it for advertising.
        </p>
      </Clause>

      <Clause heading="Who it is shared with">
        <p>
          Form submissions are delivered to our business email through Google&apos;s mail servers,
          and are also recorded in Zafe, the customer-inquiry platform we use to track leads (hosted
          on Supabase infrastructure). Page-view data goes to that same platform. These providers
          process the data on our behalf.
        </p>
        <p>
          Beyond that, we share information only where we are legally required to, or where it is
          necessary to complete work you have asked us to do.
        </p>
      </Clause>

      <Clause heading="How long we keep it">
        <p>
          Inquiries are retained as long as they are useful for servicing the customer relationship
          and for ordinary business records. You can ask us to delete your information at any time
          using the contact details above, and we will do so unless we are required to keep it.
        </p>
      </Clause>

      <Clause heading="Your choices">
        <p>
          You can ask us what information we hold about you, ask us to correct it, or ask us to
          delete it. Email{' '}
          <a href={`mailto:${BUSINESS.emailBusiness}`} className="text-white underline underline-offset-4 break-all">
            {BUSINESS.emailBusiness}
          </a>{' '}
          and we will handle it. You are never required to use the form — calling us directly works
          just as well.
        </p>
      </Clause>

      <Clause heading="Security">
        <p>
          The site is served over HTTPS and form submissions are transmitted over encrypted
          connections. No method of transmission or storage is perfectly secure, so we cannot
          guarantee absolute security, but we do not retain more than we need.
        </p>
      </Clause>

      <Clause heading="Changes">
        <p>
          If this policy changes, we will update the effective date at the top of this page.
          Material changes to how we handle information will be reflected here before they take
          effect.
        </p>
      </Clause>
    </LegalShell>
  );
}
