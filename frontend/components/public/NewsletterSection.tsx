'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2 className="newsletter-heading">GET CONNECTED WITH US</h2>
        <p className="newsletter-sub-heading">Join our community for motivation</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter-input"
          />
          <Button type="submit" variant="primary" size="lg">
            Join Now
          </Button>
        </form>
      </div>
    </section>
  );
}





