'use client';

import { useState } from 'react';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface NewsletterSectionProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  placeholder?: string;
}

export default function NewsletterSection({
  heading = 'GET CONNECTED WITH US',
  subheading = 'Join our community for motivation, tips, and exclusive offers.',
  buttonText = 'Join Now',
  placeholder = 'Enter your email',
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-heading">
      <div className="newsletter-section__glow" aria-hidden />
      <div className="newsletter-container">
        <div className="newsletter-icon" aria-hidden>
          <MailOutlined />
        </div>
        <h2 id="newsletter-heading" className="newsletter-heading">
          {heading}
        </h2>
        <p className="newsletter-sub-heading">{subheading}</p>

        {submitted ? (
          <p className="newsletter-success" role="status">
            <CheckCircleOutlined /> Thanks for subscribing!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <label htmlFor="newsletter-email" className="visually-hidden">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-field"
              autoComplete="email"
            />
            <button type="submit" className="newsletter-submit">
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
