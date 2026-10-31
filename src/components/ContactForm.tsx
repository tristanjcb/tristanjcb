'use client';
import { Icon } from '@/components/icons/Icon';

import { copy } from '@/content/copy';
import { useState } from 'react';
import { email } from '@/content/socials';
import { type Locale } from '@/lib/i18n';
export function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState(false);
  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get('name') ?? '').trim();
        const subject = String(data.get('subject') ?? '')
          .replace(/[\r\n]/g, ' ')
          .trim();
        const body = `${String(data.get('message') ?? '').trim()}\n\n${name}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus(true);
      }}
    >
      <label>
        {copy.ContactForm.your_name[locale]}
        <input name="name" autoComplete="name" maxLength={100} required />
      </label>
      <label>
        {copy.ContactForm.subject[locale]}
        <input name="subject" maxLength={140} required />
      </label>
      <label>
        {copy.ContactForm.your_message[locale]}
        <textarea name="message" maxLength={1500} required />
      </label>
      <button className="button" type="submit">
        {copy.ContactForm.prepare_my_email[locale]} <Icon name="mail" />
      </button>
      <small>{copy.ContactForm.this_form_opens_your_email_application[locale]}</small>
      {status && (
        <output style={{ marginTop: 20, fontSize: 13 }}>
          {copy.ContactForm.your_email_application_was_requested_if[locale]}
        </output>
      )}
    </form>
  );
}
