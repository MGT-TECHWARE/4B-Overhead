import { BUSINESS } from './seo/site';
import LegalShell, { Clause } from './LegalShell';

/**
 * NOTE FOR REVIEW: standard website terms, written to match how this business
 * actually operates (free quotes, no online payment, no e-commerce). It is not
 * legal advice and it is not a substitute for the written work agreement that
 * governs an actual job — have the business confirm the warranty and liability
 * wording before relying on it.
 */
export default function TermsOfService() {
  return (
    <LegalShell
      title="Terms of Service"
      crumb="Terms of Service"
      effective="August 2, 2026"
      intro={`These terms govern your use of this website. They do not replace the written estimate or work agreement for any job ${BUSINESS.legalName} performs for you.`}
    >
      <Clause heading="Using this site">
        <p>
          You may use this site to learn about our services and to contact us. Please do not use it
          to submit false information, attempt to disrupt the site, or scrape it in a way that
          degrades service for others.
        </p>
      </Clause>

      <Clause heading="Quotes and estimates">
        <p>
          Any pricing described on this site is a general range for planning purposes, not an offer.
          Real pricing depends on the opening, the door, the hardware, and the site conditions, and
          is only binding once we provide a written estimate for your specific job.
        </p>
        <p>
          Submitting the contact form or using the chat widget is a request for a quote. It does not
          create a contract, schedule work, or reserve a time slot until we confirm it with you
          directly.
        </p>
      </Clause>

      <Clause heading="Service area and availability">
        <p>
          We serve West Texas, North Texas, the Texas Panhandle, and the Red River region, and we
          travel outside it for some projects. Response times described on this site are goals based
          on typical conditions, not guarantees — weather, parts availability, and existing
          commitments all affect scheduling. We will give you a realistic ETA when you call.
        </p>
      </Clause>

      <Clause heading="Safety notice">
        <p>
          Content on this site, including blog articles, is general information — not instructions
          for you to perform repairs yourself. Garage door springs and cables are under extreme
          tension and can cause serious injury or death. Do not attempt to adjust or replace them.
          We are not responsible for injury or damage resulting from work you perform yourself based
          on information found here.
        </p>
      </Clause>

      <Clause heading="Accuracy of content">
        <p>
          We keep this site current, but product specifications, pricing ranges, and availability
          change. We do not warrant that every detail is complete or error-free at all times, and we
          may update content without notice.
        </p>
      </Clause>

      <Clause heading="Workmanship and warranties">
        <p>
          Warranty terms for materials and labor are set out in the estimate or invoice for your
          job, and manufacturer warranties are provided by the manufacturer. Nothing on this website
          creates or extends a warranty beyond those documents.
        </p>
      </Clause>

      <Clause heading="Limitation of liability">
        <p>
          To the fullest extent permitted by Texas law, {BUSINESS.legalName} is not liable for
          indirect, incidental, or consequential damages arising out of your use of this website.
          This does not limit any rights you have under the written agreement for work we perform,
          or any liability that cannot be limited by law.
        </p>
      </Clause>

      <Clause heading="Intellectual property">
        <p>
          The text, photography, and design on this site are the property of {BUSINESS.legalName}.
          Project photographs are of our own work. Please do not reuse them commercially without
          permission.
        </p>
      </Clause>

      <Clause heading="Governing law">
        <p>These terms are governed by the laws of the State of Texas.</p>
      </Clause>

      <Clause heading="Contact">
        <p>
          Questions about these terms? Call{' '}
          <a href={`tel:${BUSINESS.phone.replace(/\D/g, '').slice(-10)}`} className="text-white underline underline-offset-4">
            {BUSINESS.phoneDisplay}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${BUSINESS.emailBusiness}`} className="text-white underline underline-offset-4 break-all">
            {BUSINESS.emailBusiness}
          </a>
          .
        </p>
      </Clause>
    </LegalShell>
  );
}
