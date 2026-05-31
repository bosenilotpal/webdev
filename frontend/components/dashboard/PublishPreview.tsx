'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gym, CMSItem } from '@/lib/types';
import { getAssetPath } from '@/lib/utils';

interface PublishPreviewProps {
  listingInfo: Partial<Gym>;
  cmsData: CMSItem[];
}

export default function PublishPreview({ listingInfo, cmsData }: PublishPreviewProps) {
  const [activeTab, setActiveTab] = useState<'listing' | 'public'>('listing');
  const heroMain = cmsData.find((item) => item.name === 'Hero Section Main');
  const heroSub = cmsData.find((item) => item.name === 'Hero Section Sub');

  return (
    <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', borderBottom: '2px solid var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('listing')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            border: 'none',
            background: 'none',
            borderBottom: `3px solid ${activeTab === 'listing' ? 'var(--color-primary)' : 'transparent'}`,
            color: activeTab === 'listing' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'listing' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          Listing Card
        </button>
        <button
          onClick={() => setActiveTab('public')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            border: 'none',
            background: 'none',
            borderBottom: `3px solid ${activeTab === 'public' ? 'var(--color-primary)' : 'transparent'}`,
            color: activeTab === 'public' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'public' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          Public Page
        </button>
      </div>

      <div>
        {activeTab === 'listing' && (
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-lg)' }}>How it will appear on the listing page:</h3>
            <div className="gym-card" style={{ maxWidth: '300px' }}>
              {listingInfo.image ? (
                <div className="gym-card-image-container">
                  <img
                    src={getAssetPath(listingInfo.image)}
                    alt={listingInfo.name || 'Gym'}
                    className="gym-card-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ) : (
                <div className="gym-card-image-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                  <span>No image</span>
                </div>
              )}
              <div className="gym-card-content">
                <h4 className="gym-card-name">
                  {listingInfo.name || 'Gym Name'}
                </h4>
                <p className="gym-card-location">
                  {listingInfo.location || 'Location'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'public' && (
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-lg)' }}>Public Page Preview:</h3>
            <div style={{ background: 'var(--color-bg-dark)', padding: 'var(--spacing-2xl)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-lg)', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: 'var(--color-white)' }}>
                <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
                  {heroMain?.content || 'STAY HEALTHY, STAY FIT'}
                </p>
                <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
                  {heroSub?.content || 'GET IN SHAPE NOW'}
                </h2>
              </div>
            </div>
            <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>Your public page will include:</p>
              <ul style={{ marginBottom: 'var(--spacing-md)', paddingLeft: 'var(--spacing-lg)' }}>
                <li>Hero section with your CMS content</li>
                <li>Classes, Plans, and Trainers sections</li>
                <li>Newsletter signup</li>
                <li>Contact information from CMS</li>
              </ul>
              {listingInfo.name && (
                <Link
                  href={`/gym/preview`}
                  style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'var(--font-weight-medium)' }}
                  target="_blank"
                >
                  View Full Preview →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

