'use client';

import { CMSItem } from '@/lib/types';

interface CMSReviewProps {
  cmsData: CMSItem[];
}

export default function CMSReview({ cmsData }: CMSReviewProps) {
  const importantItems = cmsData.filter(
    (item) =>
      item.name === 'Business Email' ||
      item.name === 'Business Contact' ||
      item.name === 'Business Timing' ||
      item.name === 'Business Logo'
  );

  return (
    <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: 'var(--spacing-lg)' }}>
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Your CMS content is configured. Review the key information below:
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {importantItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{item.name}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {item.type === 'image' ? (
                <span>{item.content}</span>
              ) : (
                <span>{item.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
        <span style={{ fontSize: 'var(--font-size-xl)' }}>✓</span>
        <span>CMS Content Ready</span>
      </div>
    </div>
  );
}




