import { copy } from '@/content/copy';
import { notFound } from 'next/navigation';
import { isLocale, ui } from '@/lib/i18n';
import { email, socials } from '@/content/socials';
import { metadata } from '@/lib/seo';
import { ContactForm } from '@/components/ContactForm';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale)
    ? metadata(
        locale,
        '/contact',
        ui.contact[locale],
        copy.contact.a_project_an_idea_a_conversation[locale],
      )
    : {};
}
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="container page-content">
      <div className="page-intro">
        <p className="eyebrow">START A CONVERSATION</p>
        <h1>
          {copy.contact.it_starts[locale]}
          <br />
          <span className="serif">{copy.contact.with_a_hello[locale]}</span>
        </h1>
      </div>
      <div className="contact-layout">
        <div>
          <p>{ui.ctaBody[locale]}</p>
          <a className="contact-email" href={`mailto:${email}`}>
            {email} ↗
          </a>
          <p className="eyebrow">{copy.contact.elsewhere_on_the_web[locale]}</p>
          <div className="social-list">
            {socials.map((social) => (
              <a key={social.href} href={social.href} rel="me">
                {social.label} ↗
              </a>
            ))}
          </div>
        </div>
        <ContactForm locale={locale} />
      </div>
    </div>
  );
}
